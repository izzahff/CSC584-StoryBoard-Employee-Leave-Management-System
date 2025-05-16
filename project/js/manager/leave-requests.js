// Manager Leave Requests Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if manager is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../login.html';
        return;
    }
    
    // Parse user data
    const user = JSON.parse(currentUser);
    
    // Verify user is a manager
    if (user.role !== 'manager') {
        window.location.href = '../login.html';
        return;
    }
    
    // Initialize the page
    initLeaveRequestsPage();
});

function initLeaveRequestsPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Load leave requests
    loadLeaveRequests();
    
    // Setup event listeners
    setupEventListeners();
}

function loadLeaveRequests() {
    const leaveRequestsTable = document.getElementById('leaveRequestsTable');
    if (!leaveRequestsTable) return;
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Get pending leave requests from all employees
    let pendingRequests = [];
    users.forEach(user => {
        if (user.role === 'employee' && user.leaveHistory) {
            const userPendingRequests = user.leaveHistory
                .filter(leave => leave.status === 'pending')
                .map(leave => ({
                    ...leave,
                    employeeName: `${user.firstName} ${user.lastName}`,
                    employeeId: user.id
                }));
            pendingRequests = [...pendingRequests, ...userPendingRequests];
        }
    });
    
    // Sort by applied date (most recent first)
    pendingRequests.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    
    // Display pending requests
    if (pendingRequests.length === 0) {
        leaveRequestsTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No pending leave requests found.</td>
            </tr>
        `;
    } else {
        leaveRequestsTable.innerHTML = pendingRequests.map(request => `
            <tr>
                <td>${request.employeeName}</td>
                <td>${request.leaveType}</td>
                <td>${formatDate(request.startDate)}</td>
                <td>${formatDate(request.endDate)}</td>
                <td>${request.days} days</td>
                <td>
                    <span class="status-badge ${request.status}">${request.status}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary action-btn" onclick="viewRequest('${request.id}', '${request.employeeId}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-success action-btn" onclick="approveRequest('${request.id}', '${request.employeeId}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger action-btn" onclick="rejectRequest('${request.id}', '${request.employeeId}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// View request details
window.viewRequest = function(requestId, employeeId) {
    window.location.href = `view-leave-request.html?id=${requestId}&employeeId=${employeeId}`;
};

// Approve request
window.approveRequest = function(requestId, employeeId) {
    if (confirm('Are you sure you want to approve this leave request?')) {
        updateLeaveStatus(requestId, employeeId, 'approved');
    }
};

// Reject request
window.rejectRequest = function(requestId, employeeId) {
    if (confirm('Are you sure you want to reject this leave request?')) {
        updateLeaveStatus(requestId, employeeId, 'rejected');
    }
};

// Update leave request status
function updateLeaveStatus(requestId, employeeId, status) {
    try {
        // Get all users
        const users = JSON.parse(localStorage.getItem('users'));
        
        // Find the employee and update their leave request
        const employeeIndex = users.findIndex(u => u.id === employeeId);
        if (employeeIndex !== -1) {
            const leaveIndex = users[employeeIndex].leaveHistory.findIndex(leave => leave.id === requestId);
            if (leaveIndex !== -1) {
                users[employeeIndex].leaveHistory[leaveIndex].status = status;
                
                // Save updated users back to localStorage
                localStorage.setItem('users', JSON.stringify(users));
                
                // Refresh the leave requests display
                loadLeaveRequests();
                
                alert(`Leave request ${status} successfully.`);
            }
        }
    } catch (error) {
        console.error('Error updating leave status:', error);
        alert('Failed to update leave request status. Please try again.');
    }
}

function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = '../login.html';
        });
    }
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}