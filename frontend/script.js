const BASE_URL = "http://localhost:5000";

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Load initial data
    loadDashboardData();
    loadRecentLeaves();
});

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Add active class to clicked nav item
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'teamStatus':
            loadTeamStatus();
            break;
        case 'leaveHistory':
            loadLeaveHistory();
            break;
    }
}

function loadDashboardData() {
    // Simulate loading dashboard data
    // In real application, this would fetch from API
    setTimeout(() => {
        document.getElementById('totalEmployees').textContent = '24';
        document.getElementById('onLeaveToday').textContent = '5';
        document.getElementById('availableToday').textContent = '19';
        document.getElementById('pendingRequests').textContent = '3';
    }, 500);
}

function loadRecentLeaves() {
    fetch(`${BASE_URL}/leaves`)
        .then(res => res.json())
        .then(data => {
            const recentLeaves = data.slice(-5); // Get last 5 leaves
            let html = '<div class="recent-leaves-list">';
            
            recentLeaves.forEach(leave => {
                html += `
                    <div class="recent-leave-item">
                        <span><strong>${leave.employeeId}</strong></span>
                        <span>${leave.leaveDays} days</span>
                        <span class="status-badge status-${leave.status.toLowerCase()}">${leave.status}</span>
                    </div>
                `;
            });
            
            html += '</div>';
            document.getElementById('recentLeaves').innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            // Show sample data if API fails
            document.getElementById('recentLeaves').innerHTML = `
                <div class="recent-leave-item">
                    <span><strong>E101</strong></span>
                    <span>5 days</span>
                    <span class="status-badge status-approved">Approved</span>
                </div>
                <div class="recent-leave-item">
                    <span><strong>E102</strong></span>
                    <span>3 days</span>
                    <span class="status-badge status-pending">Pending</span>
                </div>
            `;
        });
}

function applyLeave() {
    const employeeId = document.getElementById("employeeId").value;
    const employeeName = document.getElementById("employeeName").value;
    const leaveDays = parseInt(document.getElementById("leaveDays").value);
    const leaveType = document.getElementById("leaveType").value;
    const startDate = document.getElementById("startDate").value;
    const reason = document.getElementById("reason").value;

    // Validate form
    if (!employeeId || !employeeName || !leaveDays || !startDate) {
        showMessage('leaveResult', 'Please fill in all required fields', 'error');
        return;
    }

    const leaveData = {
        employeeId,
        employeeName,
        leaveDays,
        leaveType,
        startDate,
        reason,
        status: 'Pending'
    };

    fetch(`${BASE_URL}/leave`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(leaveData)
    })
    .then(res => res.json())
    .then(data => {
        const riskScore = data.riskScore || Math.floor(Math.random() * 100);
        let riskLevel = 'Low';
        let riskColor = 'green';
        
        if (riskScore > 70) {
            riskLevel = 'High';
            riskColor = 'red';
        } else if (riskScore > 40) {
            riskLevel = 'Medium';
            riskColor = 'orange';
        }

        showMessage('leaveResult', `
            <div class="success-message">
                <strong>Status:</strong> ${data.status}<br>
                <strong>Risk Score:</strong> <span style="color: ${riskColor}">${riskScore} (${riskLevel})</span><br>
                <strong>Application ID:</strong> LVE${Math.floor(Math.random() * 10000)}
            </div>
        `, 'success');
        
        // Clear form
        document.getElementById("leaveForm").reset();
    })
    .catch(err => {
        console.error(err);
        showMessage('leaveResult', 'Error submitting leave application. Please try again.', 'error');
    });
}

function loadTeamStatus() {
    const teamStatusDiv = document.getElementById("teamStatus");
    teamStatusDiv.innerHTML = '<div class="loading">Loading team status...</div>';

    fetch(`${BASE_URL}/team-status`)
        .then(res => res.json())
        .then(data => {
            teamStatusDiv.innerHTML = `
                <div class="status-summary">
                    <div class="status-item">
                        <span class="status-label">Total Team Members:</span>
                        <span class="status-value">${data.totalMembers || 24}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Currently Available:</span>
                        <span class="status-value status-available">${data.available || 19}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">On Leave Today:</span>
                        <span class="status-value status-onleave">${data.onLeave || 5}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Expected Back Tomorrow:</span>
                        <span class="status-value">${data.expectedBack || 3}</span>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            console.error(err);
            // Show sample data if API fails
            teamStatusDiv.innerHTML = `
                <div class="status-summary">
                    <div class="status-item">
                        <span class="status-label">Total Team Members:</span>
                        <span class="status-value">24</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Currently Available:</span>
                        <span class="status-value status-available">19</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">On Leave Today:</span>
                        <span class="status-value status-onleave">5</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Expected Back Tomorrow:</span>
                        <span class="status-value">3</span>
                    </div>
                </div>
            `;
        });
}

function loadLeaveHistory() {
    const historyDiv = document.getElementById("leaveHistory");
    historyDiv.innerHTML = '<div class="loading">Loading leave history...</div>';

    fetch(`${BASE_URL}/leaves`)
        .then(res => res.json())
        .then(data => {
            let html = '<div class="history-list">';
            
            if (data.length === 0) {
                html += '<div class="no-data">No leave records found</div>';
            } else {
                data.forEach(leave => {
                    const statusClass = leave.status ? leave.status.toLowerCase() : 'pending';
                    html += `
                        <div class="history-item">
                            <div class="history-item-header">
                                <span class="employee-id">${leave.employeeId || 'N/A'}</span>
                                <span class="leave-days">${leave.leaveDays || 0} days</span>
                                <span class="status-badge status-${statusClass}">${leave.status || 'Pending'}</span>
                            </div>
                            <div class="history-item-details">
                                <span>Type: ${leave.leaveType || 'Annual'}</span>
                                <span>Start: ${leave.startDate || 'N/A'}</span>
                            </div>
                        </div>
                    `;
                });
            }
            
            html += '</div>';
            historyDiv.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            // Show sample data if API fails
            historyDiv.innerHTML = `
                <div class="history-list">
                    <div class="history-item">
                        <div class="history-item-header">
                            <span class="employee-id">E101</span>
                            <span class="leave-days">5 days</span>
                            <span class="status-badge status-approved">Approved</span>
                        </div>
                        <div class="history-item-details">
                            <span>Type: Annual</span>
                            <span>Start: 2024-01-15</span>
                        </div>
                    </div>
                    <div class="history-item">
                        <div class="history-item-header">
                            <span class="employee-id">E102</span>
                            <span class="leave-days">3 days</span>
                            <span class="status-badge status-pending">Pending</span>
                        </div>
                        <div class="history-item-details">
                            <span>Type: Sick</span>
                            <span>Start: 2024-01-20</span>
                        </div>
                    </div>
                    <div class="history-item">
                        <div class="history-item-header">
                            <span class="employee-id">E103</span>
                            <span class="leave-days">2 days</span>
                            <span class="status-badge status-rejected">Rejected</span>
                        </div>
                        <div class="history-item-details">
                            <span>Type: Personal</span>
                            <span>Start: 2024-01-10</span>
                        </div>
                    </div>
                </div>
            `;
        });
}

function generateReport() {
    const month = document.getElementById("reportMonth").value;
    const year = document.getElementById("reportYear").value;
    const reportDiv = document.getElementById("reportResult");
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    reportDiv.innerHTML = `
        <div class="report-summary">
            <h4>Leave Report - ${monthNames[month-1]} ${year}</h4>
            <div class="report-stats">
                <div class="report-stat">
                    <span>Total Leave Days:</span>
                    <span>45</span>
                </div>
                <div class="report-stat">
                    <span>Average per Employee:</span>
                    <span>1.9 days</span>
                </div>
                <div class="report-stat">
                    <span>Most Common Type:</span>
                    <span>Annual Leave</span>
                </div>
                <div class="report-stat">
                    <span>Approval Rate:</span>
                    <span>85%</span>
                </div>
            </div>
        </div>
    `;
}

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = message;
    element.className = `result-message ${type}`;
}

// Add some additional CSS for status badges and messages
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .status-approved {
        background: #d4edda;
        color: #155724;
    }
    
    .status-pending {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-rejected {
        background: #f8d7da;
        color: #721c24;
    }
    
    .status-available {
        color: #28a745;
    }
    
    .status-onleave {
        color: #dc3545;
    }
    
    .recent-leave-item, .history-item {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .recent-leave-item:last-child, .history-item:last-child {
        border-bottom: none;
    }
    
    .history-item-details {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
        display: flex;
        gap: 1rem;
    }
    
    .status-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .status-item:last-child {
        border-bottom: none;
    }
    
    .status-label {
        color: #666;
    }
    
    .status-value {
        font-weight: bold;
        color: #333;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
    }
    
    .no-data {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-style: italic;
    }
    
    .success-message {
        color: #155724;
        background: #d4edda;
        padding: 1rem;
        border-radius: 5px;
    }
    
    .error-message {
        color: #721c24;
        background: #f8d7da;
        padding: 1rem;
        border-radius: 5px;
    }
    
    .report-summary {
        padding: 1rem;
    }
    
    .report-stats {
        margin-top: 1rem;
    }
    
    .report-stat {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
`;

document.head.appendChild(style);