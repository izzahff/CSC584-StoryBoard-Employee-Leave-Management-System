// Manager View Leave Request Page JavaScript

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
    initViewRequestPage();
});

function initViewRequestPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Load request details
    loadRequestDetails();
    
    // Setup event listeners
    setupEventListeners();
}

function loadRequestDetails() {
    // Get request ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    
    if (!requestId) {
        alert('No request ID provided');
        window.location.href = 'leave-requests.html';
        return;
    }
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Find employee and their leave request
    let employee, leaveRequest;
    users.forEach(user => {
        if (user.role === 'employee' && user.leaveHistory) {
            const request = user.leaveHistory.find(leave => leave.id === requestId);
            if (request) {
                employee = user;
                leaveRequest = request;
            }
        }
    });
    
    if (!employee || !leaveRequest) {
        alert('Leave request not found');
        window.location.href = 'leave-requests.html';
        return;
    }
    
    // Update page with request details
    document.getElementById('employeeName').textContent = `${employee.firstName} ${employee.lastName}`;
    document.getElementById('employeeEmail').textContent = employee.email;
    document.getElementById('leaveType').textContent = leaveRequest.leaveType;
    document.getElementById('startDate').textContent = formatDate(leaveRequest.startDate);
    document.getElementById('endDate').textContent = formatDate(leaveRequest.endDate);
    document.getElementById('duration').textContent = `${leaveRequest.days} days`;
    document.getElementById('appliedDate').textContent = formatDate(leaveRequest.appliedDate);
    document.getElementById('status').innerHTML = `<span class="status-badge ${leaveRequest.status}">${leaveRequest.status}</span>`;
    document.getElementById('description').textContent = leaveRequest.description;
    
    // Hide action buttons if request is not pending
    if (leaveRequest.status !== 'pending') {
        document.getElementById('approveBtn').style.display = 'none';
        document.getElementById('rejectBtn').style.display = 'none';
    }
}

function setupEventListeners() {
    // Approve button
    const approveBtn = document.getElementById('approveBtn');
    if (approveBtn) {
        approveBtn.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const requestId = urlParams.get('id');
            if (requestId) {
                if (confirm('Are you sure you want to approve this leave request?')) {
                    updateLeaveStatus(requestId, 'approved');
                }
            }
        });
    }
    
    // Reject button
    const rejectBtn = document.getElementById('rejectBtn');
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const requestId = urlParams.get('id');
            if (requestId) {
                if (confirm('Are you sure you want to reject this leave request?')) {
                    updateLeaveStatus(requestId, 'rejected');
                }
            }
        });
    }
    
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', handlePrint);
    }
    
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

function updateLeaveStatus(requestId, status) {
    // Get all users
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Find the employee and update their leave request
    users.forEach(user => {
        if (user.role === 'employee' && user.leaveHistory) {
            const leaveIndex = user.leaveHistory.findIndex(leave => leave.id === requestId);
            if (leaveIndex !== -1) {
                user.leaveHistory[leaveIndex].status = status;
            }
        }
    });
    
    // Save updated users back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    alert(`Leave request ${status} successfully.`);
    window.location.href = 'leave-requests.html';
}

function handlePrint() {
    window.print();
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}