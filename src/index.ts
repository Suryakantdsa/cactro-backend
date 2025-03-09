import express from "express";
import cors from "cors";

const PORT = process.env.PORT || "8008";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.status(201).json({
    message: "server working fine",
  });
});
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
