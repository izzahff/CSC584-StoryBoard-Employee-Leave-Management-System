// Main JavaScript file for the IMNSB Employee Leave Management System

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the role selection page
    const roleButtons = document.querySelectorAll('.role-btn');
    if (roleButtons.length > 0) {
        // Add click event listeners to role buttons
        roleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                roleButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked button
                this.classList.add('active');
                
                // Store the selected role in localStorage
                const selectedRole = this.getAttribute('data-role');
                localStorage.setItem('selectedRole', selectedRole);
                
                // Redirect to appropriate login page after a brief delay
                setTimeout(() => {
                    switch (selectedRole) {
                        case 'manager':
                            window.location.href = 'manager/login.html';
                            break;
                        case 'admin':
                            window.location.href = 'admin/login.html';
                            break;
                        default:
                            window.location.href = 'login.html';
                    }
                }, 500);
            });
        });
    }
    
    // Check if user is logged in
    checkAuthStatus();
});

// Function to check if user is logged in
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    // If no user is logged in and we're not on the auth pages, redirect to login
    if (!currentUser) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('index.html') && 
            !currentPath.includes('login.html') && 
            !currentPath.includes('signup.html') &&
            !currentPath.includes('manager/login.html') &&
            !currentPath.includes('manager/signup.html') &&
            !currentPath.includes('admin/login.html') &&
            !currentPath.includes('admin/signup.html')) {
            window.location.href = 'login.html';
        }
    } else {
        // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
        const user = JSON.parse(currentUser);
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('index.html') || 
            currentPath.includes('login.html') || 
            currentPath.includes('signup.html') ||
            currentPath.includes('manager/login.html') ||
            currentPath.includes('manager/signup.html') ||
            currentPath.includes('admin/login.html') ||
            currentPath.includes('admin/signup.html')) {
            switch (user.role) {
                case 'manager':
                    window.location.href = 'manager/profile.html';
                    break;
                case 'admin':
                    window.location.href = 'admin/profile.html';
                    break;
                default:
                    window.location.href = 'profile.html';
            }
        }
    }
}