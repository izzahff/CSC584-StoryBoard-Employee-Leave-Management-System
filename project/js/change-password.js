// Change password functionality

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
    
    // Handle form submission
    const form = document.getElementById('changePasswordForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Verify current password
            if (currentPassword !== user.password) {
                alert('Current password is incorrect.');
                return;
            }
            
            // Validate new password
            if (!validatePassword(newPassword)) {
                alert('New password does not meet the requirements.');
                return;
            }
            
            // Check if passwords match
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match.');
                return;
            }
            
            // Update password
            const updatedUser = {
                ...user,
                password: newPassword
            };
            
            // Update user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // Update users array
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Show success message and redirect
            alert('Password changed successfully.');
            window.location.href = 'settings.html';
        });
    }
    
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

// Function to validate password
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