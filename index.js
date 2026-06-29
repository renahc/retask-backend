import express from "express";
import { PORT } from "./config.js";
import morgan from "morgan";
import tasks from "./db/tasks.js";
import connectDB from "./db/db.js";
import { validateTask, validateTaskPartial } from "./schemas/task.scheme.js";

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

  const taskCreated = await tasks.create(data);

  res.status(201).json(taskCreated);
});

app.put("/api/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const { success, data, error } = validateTaskPartial(req.body);

  if (error)
    return res.status(500).json({ message: JSON.parse(error.message) });

  const task = await tasks.findByIdAndUpdate(id, data);

  if (!task) return res.status(404).json({ message: "Task not found" });

  const taskUpdated = {
    ...task._doc,
    ...data,
  };

  return res.status(200).json(taskUpdated);
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
