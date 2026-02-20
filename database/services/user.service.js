const User = require("../models/user.model");

const createUser = async (data) => {
  return await User.create(data);
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = { createUser, getAllUsers };