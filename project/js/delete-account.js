// Delete account functionality

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
    const form = document.getElementById('deleteAccountForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmDelete = document.getElementById('confirmDelete').checked;
            
            // Verify password
            if (password !== user.password) {
                alert('Incorrect password.');
                return;
            }
            
            // Confirm checkbox must be checked
            if (!confirmDelete) {
                alert('Please confirm that you understand this action is permanent.');
                return;
            }
            
            // Final confirmation
            if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                return;
            }
            
            // Remove user from users array
            const users = JSON.parse(localStorage.getItem('users'));
            const updatedUsers = users.filter(u => u.id !== user.id);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Clear current user
            localStorage.removeItem('currentUser');
            
            // Show success message and redirect
            alert('Your account has been successfully deleted.');
            window.location.href = 'index.html';
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