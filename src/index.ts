import express from "express";
import cors from "cors";
import { config } from "dotenv";
import axios from "axios";
import { IUSerData } from "./Interfaces/IUserData";
import { IRepoData } from "./Interfaces/IReposData";
config();

const app = express();

app.use(express.json());
app.use(cors());

const GITHUB_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const PORT = process.env.PORT || "8008";

const axiosInstance = axios.create({
  baseURL: GITHUB_URL,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: `application/vnd.github.v3+json`,
  },
});

app.get("/health", (req, res) => {
  res.status(201).json({
    message: "server working fine",
  });
});

app.get("/github", async (req, res) => {
  try {
    const userRes = await axiosInstance.get(
      `users/${process.env.GITHUB_USERNAME}`
    );
    const userData = userRes.data as IUSerData;

    const repoRes = await axiosInstance.get(`users/${GITHUB_USERNAME}/repos`);
    const repoData = repoRes.data as IRepoData[];

    res.status(201).json({
      username: userData.login,
      name: userData.name,
      follower: userData.followers,
      following: userData.following,
      public_repos: userData.public_repos,
      private_repos: repoData.filter((repo) => repo.private).length,
      repositories: repoData.map((repo: IRepoData) => ({
        name: repo.name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/github/:repo_name", async (req, res) => {
  const { repo_name } = req.params;
  try {
    const repoDetailsRes = await axiosInstance(
      `/repos/${GITHUB_USERNAME}/${repo_name}`
    );

    const repoDetails = repoDetailsRes.data;
    res.json({
      name: repoDetails.name,
      description: repoDetails.description,
      stars: repoDetails.stargazers_count,
      forks: repoDetails.forks_count,
      open_issues: repoDetails.open_issues_count,
      language: repoDetails.language,
      repo_url: repoDetails.html_url,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.response?.data || "Error fetching repository details",
    });
  }
});

app.post("/github/:repo_name/issues", async (req, res) => {
  const { repo_name } = req.params;
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400).json({ error: "Title and body are required." });
    return;
  }

  try {
    const issueRes = await axiosInstance.post(
      `/repos/${GITHUB_USERNAME}/${repo_name}/issues`,
      {
        title,
        body,
      }
    );
    res.json({ issue_url: issueRes.data.html_url });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.response?.data || "Error creating issue" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
