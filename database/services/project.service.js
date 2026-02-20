const Project = require("../models/project.model");

const createProject = async (data) => {
  return await Project.create(data);
};

const getProjects = async () => {
  return await Project.find().populate("team");
};

module.exports = { createProject, getProjects };