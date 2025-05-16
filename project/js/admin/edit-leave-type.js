// Edit Leave Type Page JavaScript

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
    initEditLeaveTypePage();
});

function initEditLeaveTypePage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Load leave type data
    loadLeaveTypeData();
    
    // Setup form submission
    setupForm();
    
    // Setup other event listeners
    setupEventListeners();
}

function loadLeaveTypeData() {
    const leaveTypeId = localStorage.getItem('editLeaveTypeId');
    if (!leaveTypeId) {
        alert('No leave type selected for editing');
        window.location.href = 'leave-types.html';
        return;
    }
    
    const leaveTypes = JSON.parse(localStorage.getItem('leaveTypes') || '[]');
    const leaveType = leaveTypes.find(type => type.id === leaveTypeId);
    
    if (!leaveType) {
        alert('Leave type not found');
        window.location.href = 'leave-types.html';
        return;
    }
    
    // Populate form fields
    document.getElementById('name').value = leaveType.name;
    document.getElementById('description').value = leaveType.description;
}

function setupForm() {
    const form = document.getElementById('editLeaveTypeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const leaveTypeId = localStorage.getItem('editLeaveTypeId');
            if (!leaveTypeId) return;
            
            // Get form values
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            
            try {
                // Get existing leave types
                const leaveTypes = JSON.parse(localStorage.getItem('leaveTypes') || '[]');
                
                // Find and update the leave type
                const index = leaveTypes.findIndex(type => type.id === leaveTypeId);
                if (index !== -1) {
                    leaveTypes[index] = {
                        ...leaveTypes[index],
                        name,
                        description
                    };
                    
                    // Save back to localStorage
                    localStorage.setItem('leaveTypes', JSON.stringify(leaveTypes));
                    
                    alert('Leave type updated successfully');
                    window.location.href = 'leave-types.html';
                }
            } catch (error) {
                console.error('Error updating leave type:', error.message);
                alert('Failed to update leave type. Please try again.');
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