const express = require("express");
const cors = require("cors");

const evaluateLeave = require("../rule-engine/logic");
const {
    saveLeave,
    getLeaveHistory,
    getEmployeeWorkload,
    getTeamStatus
} = require("../database/schema");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Single clean leave route
app.post("/leave", (req, res) => {
    const { employeeId, leaveDays } = req.body;

    const workloadScore = getEmployeeWorkload(employeeId);
    const teamData = getTeamStatus();

    const teamAvailability =
        (teamData.available / teamData.totalMembers) * 100;

    const deadlineDays = 4; // simulate for now

    const evaluationResult = evaluateLeave({
        workloadScore,
        teamAvailability,
        deadlineDays
    });

    saveLeave({
        employeeId,
        leaveDays,
        status: evaluationResult.status
    });

    res.json({
        employeeId,
        leaveDays,
        ...evaluationResult
    });
});
app.get("/team-status", (req, res) => {
    const status = getTeamStatus();
    res.json(status);
});
app.get("/workload/:employeeId", (req, res) => {
    const employeeId = req.params.employeeId;
    const workload = getEmployeeWorkload(employeeId);

    if (workload === null) {
        return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
        employeeId,
        workloadScore: workload
    });
});
app.get("/leaves", (req, res) => {
    res.json(getLeaveHistory());
});
app.get("/leaves", (req, res) => {
    res.json(leaveHistory);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});