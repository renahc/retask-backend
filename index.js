import express from "express";
import { PORT } from "./config.js";
import morgan from "morgan";
import tasks from "./db/tasks.js";
import connectDB from "./db/db.js";

connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

// GET ALL TASKS
app.get("/api/tasks", async (req, res) => {
  const task = await tasks.find();
  return res.status(200).json(task);
});

// CREATE TASK
app.post("/api/tasks", async (req, res) => {
  const { success, data, error } = validateTask(req.body);

  if (error)
    return res.status(500).json({ message: JSON.parse(error.message) });

  const create = await tasks.create(data);

  res.status(201).json(create);
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
