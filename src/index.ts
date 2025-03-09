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

    const repoRes = await axiosInstance.get(
      `users/${process.env.GITHUB_USERNAME}/repos`
    );
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

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
