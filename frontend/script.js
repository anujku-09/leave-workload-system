const BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function() {
    // Sidebar navigation
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Form submission
    document.getElementById("leaveForm").addEventListener("submit", function(event) {
        event.preventDefault();
        applyLeave();
    });
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function applyLeave() {
    const employeeId = document.getElementById("employeeId").value;
    const leaveDays = parseInt(document.getElementById("leaveDays").value);
    const startDate = document.getElementById("startDate").value;
    const reason = document.getElementById("reason").value;

    fetch(`${BASE_URL}/leave`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ employeeId, leaveDays, startDate, reason })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("leaveResult").innerHTML =
            `Status: <b>${data.status}</b><br>Risk Score: ${data.riskScore}`;
    })
    .catch(err => {
        console.error(err);
        document.getElementById("leaveResult").innerHTML = "Error submitting leave request.";
    });
}

function loadTeamStatus() {
    fetch(`${BASE_URL}/team-status`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("teamStatus").innerHTML =
                `Total Members: ${data.totalMembers}<br>
                 Available: ${data.available}<br>
                 On Leave: ${data.onLeave}`;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("teamStatus").innerHTML = "Error loading team status.";
        });
}

function loadLeaveHistory() {
    fetch(`${BASE_URL}/leaves`)
        .then(res => res.json())
        .then(data => {
            let html = "";

            data.forEach(leave => {
                html += `Employee: ${leave.employeeId} | Days: ${leave.leaveDays} | Status: ${leave.status}<br>`;
            });

            document.getElementById("leaveHistory").innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("leaveHistory").innerHTML = "Error loading leave history.";
        });
}