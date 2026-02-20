function evaluateLeave(data) {

    if (data.days <= 2) {
        return { status: "Approved", risk: "Low" };
    }

    return { status: "Pending", risk: "Medium" };
}

module.exports = evaluateLeave;