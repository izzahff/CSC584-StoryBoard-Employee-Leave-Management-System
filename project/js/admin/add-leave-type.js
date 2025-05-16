// Add Leave Type Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../login.html';
        return;
    }
    
    // Parse user data
    const user = JSON.parse(currentUser);
    
    // Verify user is an admin
    if (user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Initialize the page
    initAddLeaveTypePage();
});

function initAddLeaveTypePage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Setup form submission
    setupForm();
    
    // Setup other event listeners
    setupEventListeners();
}

function setupForm() {
    const form = document.getElementById('addLeaveTypeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            
            try {
                // Get existing leave types
                const leaveTypes = JSON.parse(localStorage.getItem('leaveTypes') || '[]');
                
                // Create new leave type
                const newLeaveType = {
                    id: 'lt' + Date.now(),
                    name,
                    description,
                    isActive: true
                };
                
                // Add to leave types array
                leaveTypes.push(newLeaveType);
                
                // Save back to localStorage
                localStorage.setItem('leaveTypes', JSON.stringify(leaveTypes));
                
                alert('Leave type added successfully');
                window.location.href = 'leave-types.html';
            } catch (error) {
                console.error('Error adding leave type:', error.message);
                alert('Failed to add leave type. Please try again.');
            }
        });
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