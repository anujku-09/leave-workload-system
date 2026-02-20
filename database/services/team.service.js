const Team = require("../models/team.model");

const createTeam = async (data) => {
  return await Team.create(data);
};

const getTeams = async () => {
  return await Team.find().populate("manager members");
};

module.exports = { createTeam, getTeams };