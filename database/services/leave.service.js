const Leave = require("../models/leave.model");

const createLeave = async (data) => {
  return await Leave.create(data);
};

const getLeavesByUser = async (userId) => {
  return await Leave.find({ employee: userId }).populate("employee");
};

const updateLeaveStatus = async (leaveId, status) => {
  return await Leave.findByIdAndUpdate(
    leaveId,
    { status },
    { new: true }
  );
};

module.exports = {
  createLeave,
  getLeavesByUser,
  updateLeaveStatus
};