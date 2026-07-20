import { TaskModel } from "../models/tasks.model.js";
import { validateTask, validateTaskPartial } from "../schemas/task.scheme.js";

export class TaskController {
  static getAll = async (req, res) => {
    try {
      const tasks = await TaskModel.getAll({ userId: req.user.id });

      return res.status(200).json(tasks);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  static create = async (req, res) => {
    try {
      const { success, data, error } = validateTask(req.body);

      if (error)
        return res.status(400).json({ message: JSON.parse(error.message) });

      const taskToSave = {
        ...data,
        userId: req.user.id,
      };

      const taskCreated = await TaskModel.create({ data: taskToSave });

      res.status(201).json(taskCreated);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  static update = async (req, res) => {
    try {
      const id = req.params.id;

      const { success, data, error } = validateTaskPartial(req.body);

      if (error)
        return res.status(400).json({ message: JSON.parse(error.message) });

      const taskFinded = await TaskModel.findById({ id });

      if (!taskFinded)
        return res.status(404).json({ message: "Task not found" });

      if (taskFinded.userId.toString() !== req.user.id)
        return res
          .status(403)
          .json({ message: "You are not the owner of this task" });

      const taskUpdated = await TaskModel.update({
        id,
        data,
        userId: req.user.id,
      });

      const task = {
        ...taskUpdated._doc,
        ...data,
      };

      return res.status(200).json(task);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  static delete = async (req, res) => {
    const id = req.params.id;

    const taskFinded = await TaskModel.findById({ id });

    if (!taskFinded) return res.status(404).json({ message: "Task not found" });

    if (taskFinded.userId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not the owner of this task" });

    const taskDeleted = await TaskModel.delete({ id });

    return res.status(200).json({ message: "Task deleted" });
  };
}
