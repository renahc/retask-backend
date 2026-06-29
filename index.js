import express from "express";
import { PORT } from "./config.js";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
