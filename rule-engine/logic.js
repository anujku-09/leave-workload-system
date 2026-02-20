//rule logic for the leave application is shown below. Takes workload score, team availability and deadline days as input and returns the decision along with the risk score.
function decideLeave(data) {
    const { workloadScore, teamAvailability, deadlineDays } = data;

    let risk = 0;

    if (workloadScore > 85) risk += 2;
    else if (workloadScore > 70) risk += 1;

    if (deadlineDays < 3) risk += 2;
    else if (deadlineDays <= 5) risk += 1;

    if (teamAvailability < 50) risk += 2;
    else if (teamAvailability <= 70) risk += 1;

    if (risk >= 4)
        return { status: "REJECTED", riskScore: risk };

    if (risk >= 2)
        return { status: "MANAGER_APPROVAL", riskScore: risk };

    return { status: "APPROVED", riskScore: risk };
}

module.exports = decideLeave;