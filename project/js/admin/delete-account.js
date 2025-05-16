// Admin Delete Account Page JavaScript

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
    initDeleteAccountPage();
});

function initDeleteAccountPage() {
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
    const form = document.getElementById('deleteAccountForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmDelete = document.getElementById('confirmDelete').checked;
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            // Verify password
            if (password !== currentUser.password) {
                alert('Incorrect password');
                return;
            }
            
            // Confirm checkbox must be checked
            if (!confirmDelete) {
                alert('Please confirm that you understand this action is permanent');
                return;
            }
            
            // Final confirmation
            if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                return;
            }
            
            try {
                // Remove admin from admin officers array
                const adminOfficers = JSON.parse(localStorage.getItem('adminOfficers') || '[]');
                const updatedAdminOfficers = adminOfficers.filter(admin => admin.id !== currentUser.id);
                localStorage.setItem('adminOfficers', JSON.stringify(updatedAdminOfficers));
                
                // Clear current user
                localStorage.removeItem('currentUser');
                
                alert('Your account has been successfully deleted');
                window.location.href = '../index.html';
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account. Please try again.');
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