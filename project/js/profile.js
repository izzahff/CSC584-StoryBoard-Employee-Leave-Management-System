// Profile page functionality

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
    
    // Populate profile information
    populateProfileInfo(user);
    
    // Handle sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
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

// Function to populate profile information
function populateProfileInfo(user) {
    // Profile details
    const profileIdElement = document.getElementById('profileId');
    const profileNameElement = document.getElementById('profileName');
    const profileEmailElement = document.getElementById('profileEmail');
    const profilePhoneElement = document.getElementById('profilePhone');
    
    if (profileIdElement) profileIdElement.textContent = user.employeeId;
    if (profileNameElement) profileNameElement.textContent = `${user.firstName} ${user.lastName}`;
    if (profileEmailElement) profileEmailElement.textContent = user.email;
    if (profilePhoneElement) profilePhoneElement.textContent = user.phone;
    
    // Leave statistics
    const totalLeaveEntitledElement = document.getElementById('totalLeaveEntitled');
    const leaveUsedCountElement = document.getElementById('leaveUsedCount');
    const leaveBalanceCountElement = document.getElementById('leaveBalanceCount');
    const pendingLeaveCountElement = document.getElementById('pendingLeaveCount');
    const approvedLeaveCountElement = document.getElementById('approvedLeaveCount');
    const rejectedLeaveCountElement = document.getElementById('rejectedLeaveCount');
    
    // Calculate leave statistics
    const leaveHistory = user.leaveHistory || [];
    const pendingLeaves = leaveHistory.filter(leave => leave.status === 'pending');
    const approvedLeaves = leaveHistory.filter(leave => leave.status === 'approved');
    const rejectedLeaves = leaveHistory.filter(leave => leave.status === 'rejected');
    
    // Calculate used leave days (approved leaves)
    let usedLeaveDays = 0;
    approvedLeaves.forEach(leave => {
        usedLeaveDays += calculateDays(leave.startDate, leave.endDate);
    });
    
    // Update DOM elements
    if (totalLeaveEntitledElement) totalLeaveEntitledElement.textContent = user.leaveBalance + usedLeaveDays;
    if (leaveUsedCountElement) leaveUsedCountElement.textContent = usedLeaveDays;
    if (leaveBalanceCountElement) leaveBalanceCountElement.textContent = user.leaveBalance;
    if (pendingLeaveCountElement) pendingLeaveCountElement.textContent = pendingLeaves.length;
    if (approvedLeaveCountElement) approvedLeaveCountElement.textContent = approvedLeaves.length;
    if (rejectedLeaveCountElement) rejectedLeaveCountElement.textContent = rejectedLeaves.length;
}

// Helper function to calculate days between two dates
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
    return diffDays;
}