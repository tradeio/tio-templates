import express from "express";
import { PORT } from "./config/envs";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ status: true, message: "Our node.js app works" });
});

app.listen(PORT, () =>
  console.log(`App listening at port http://localhost:${PORT}`)
);
