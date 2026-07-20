import tasks from "../db/tasks.js";

export class TaskModel {
  static getAll = async ({ userId }) => {
    const task = await tasks.find({ userId });

    return task;
  };

  static create = async ({ data }) => {
    return await tasks.create(data);
  };

  static update = async ({ id, data }) => {
    return await tasks.findByIdAndUpdate(id, data);
  };

  static delete = async ({ id, userId }) => {
    return await tasks.findByIdAndDelete(id);
  };

  static findById = async ({ id }) => {
    return await tasks.findById(id);
  };
}
