// Dashboard related functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Parse user data
    const user = JSON.parse(currentUser);
    
    // Update user info in the header
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    // Update leave statistics
    updateLeaveStatistics(user);
    
    // Populate recent leaves table
    populateRecentLeaves(user);
    
    // Handle sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Load sidebar state from localStorage
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Save sidebar state to localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data from localStorage
            localStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
});

// Function to update leave statistics on the dashboard
function updateLeaveStatistics(user) {
    // Get DOM elements
    const leaveBalanceElement = document.getElementById('leaveBalance');
    const leaveUsedElement = document.getElementById('leaveUsed');
    const pendingRequestsElement = document.getElementById('pendingRequests');
    const approvedLeavesElement = document.getElementById('approvedLeaves');
    
    // Calculate statistics
    const leaveHistory = user.leaveHistory || [];
    const pendingLeaves = leaveHistory.filter(leave => leave.status === 'pending');
    const approvedLeaves = leaveHistory.filter(leave => leave.status === 'approved');
    
    // Calculate used leave days (approved leaves)
    let usedLeaveDays = 0;
    approvedLeaves.forEach(leave => {
        usedLeaveDays += calculateDays(leave.startDate, leave.endDate);
    });
    
    // Update DOM elements
    if (leaveBalanceElement) {
        leaveBalanceElement.textContent = `${user.leaveBalance} days`;
    }
    
    if (leaveUsedElement) {
        leaveUsedElement.textContent = `${usedLeaveDays} days`;
    }
    
    if (pendingRequestsElement) {
        pendingRequestsElement.textContent = pendingLeaves.length;
    }
    
    if (approvedLeavesElement) {
        approvedLeavesElement.textContent = approvedLeaves.length;
    }
}

// Function to populate recent leaves table
function populateRecentLeaves(user) {
    const tableBody = document.getElementById('recentLeavesTable');
    if (!tableBody) return;
    
    // Get leave history and sort by date (most recent first)
    const leaveHistory = user.leaveHistory || [];
    const recentLeaves = [...leaveHistory].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5);
    
    // Clear existing table rows
    tableBody.innerHTML = '';
    
    // Create table rows for recent leaves
    if (recentLeaves.length === 0) {
        // If no leave history, show a message
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="text-center">No leave applications found.</td>
        `;
        tableBody.appendChild(row);
    } else {
        recentLeaves.forEach(leave => {
            const row = document.createElement('tr');
            
            const statusClass = 
                leave.status === 'pending' ? 'status-pending' :
                leave.status === 'approved' ? 'status-approved' :
                leave.status === 'rejected' ? 'status-rejected' : 'status-cancelled';
            
            row.innerHTML = `
                <td>${leave.leaveType}</td>
                <td>${formatDate(leave.startDate)}</td>
                <td>${formatDate(leave.endDate)}</td>
                <td>${calculateDays(leave.startDate, leave.endDate)} days</td>
                <td><span class="status-badge ${statusClass}">${leave.status}</span></td>
                <td>
                    <button class="btn btn-primary action-btn view-btn" data-id="${leave.id}">View</button>
                    ${leave.status === 'pending' ? `<button class="btn btn-danger action-btn cancel-btn" data-id="${leave.id}">Cancel</button>` : ''}
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const leaveId = this.getAttribute('data-id');
                // Redirect to leave details page (to be implemented)
                alert(`View leave details for ID: ${leaveId}`);
            });
        });
        
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', function() {
                const leaveId = this.getAttribute('data-id');
                cancelLeaveRequest(leaveId);
            });
        });
    }
}

// Function to cancel a leave request
function cancelLeaveRequest(leaveId) {
    // Confirm before cancelling
    if (!confirm('Are you sure you want to cancel this leave request?')) {
        return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Find the leave request
    const leaveIndex = currentUser.leaveHistory.findIndex(leave => leave.id === leaveId);
    if (leaveIndex === -1) return;
    
    // Update leave status to cancelled
    currentUser.leaveHistory[leaveIndex].status = 'cancelled';
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Refresh the dashboard
    updateLeaveStatistics(currentUser);
    populateRecentLeaves(currentUser);
    
    alert('Leave request cancelled successfully.');
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

// Helper function to calculate days between two dates
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
    return diffDays;
}