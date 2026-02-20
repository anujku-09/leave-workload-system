const Task = require("../models/task.model");

const createTask = async (data) => {
  return await Task.create(data);
};

const getTasks = async () => {
  return await Task.find().populate("project assignedTo");
};

module.exports = { createTask, getTasks };