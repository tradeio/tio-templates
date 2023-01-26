import express from "express";
import { PORT } from "./config/envs";
import folderRouter from "./utils/folderRouter";
import path from "path";

const app = express();

app.use(express.json());

folderRouter(app, path.resolve(__dirname, "./routes")).then(() => {
  app.get("/", async (req, res) => {
    res.json({ status: true, message: "Our node.js app works" });
  });

  app.use("*", (req, res) => {
    // 404 -- When no route is matched
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    // 500 -- When an error is thrown
    res.status(500).json({ message: "Internal server error" });
  });

  app.listen(PORT, () =>
    console.log(`App listening at port http://localhost:${PORT}`)
  );
});
