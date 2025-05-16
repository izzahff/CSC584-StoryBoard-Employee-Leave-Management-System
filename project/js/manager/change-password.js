// Manager Change Password Page JavaScript

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
    initChangePasswordPage();
});

function initChangePasswordPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Handle form submission
    const form = document.getElementById('changePasswordForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            // Verify current password
            if (currentPassword !== currentUser.password) {
                alert('Current password is incorrect');
                return;
            }
            
            // Validate new password
            if (!validatePassword(newPassword)) {
                alert('New password does not meet the requirements');
                return;
            }
            
            // Check if passwords match
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }
            
            try {
                // Update user password
                const updatedUser = {
                    ...currentUser,
                    password: newPassword
                };
                
                // Update current user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                // Update users array
                const users = JSON.parse(localStorage.getItem('users'));
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = updatedUser;
                    localStorage.setItem('users', JSON.stringify(users));
                }
                
                alert('Password changed successfully');
                window.location.href = 'settings.html';
            } catch (error) {
                console.error('Error changing password:', error);
                alert('Failed to change password. Please try again.');
            }
        });
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

function validatePassword(password) {
    // At least 8 characters long
    if (password.length < 8) return false;
    
    // Contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // Contains at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    
    // Contains at least one number
    if (!/[0-9]/.test(password)) return false;
    
    // Contains at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    
    return true;
}