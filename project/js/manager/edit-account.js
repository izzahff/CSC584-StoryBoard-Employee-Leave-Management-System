// Manager Edit Account Page JavaScript

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
    initEditAccountPage();
});

function initEditAccountPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const headerAvatar = document.getElementById('headerAvatar');
    const profilePreview = document.getElementById('profilePreview');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Update avatar images if user has a profile picture
    if (currentUser.profilePicture) {
        if (headerAvatar) headerAvatar.src = currentUser.profilePicture;
        if (profilePreview) profilePreview.src = currentUser.profilePicture;
    }
    
    // Populate form with current user data
    populateForm(currentUser);
    
    // Setup event listeners
    setupEventListeners();
}

function populateForm(user) {
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
}

function setupEventListeners() {
    // Handle profile picture upload
    const profilePictureInput = document.getElementById('profilePicture');
    const profilePreview = document.getElementById('profilePreview');
    const headerAvatar = document.getElementById('headerAvatar');
    
    if (profilePictureInput && profilePreview) {
        profilePictureInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('File size must be less than 5MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    profilePreview.src = imageData;
                    if (headerAvatar) headerAvatar.src = imageData;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle form submission
    const form = document.getElementById('editAccountForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            // Get form values
            const updatedUser = {
                ...currentUser,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            // Add profile picture if changed
            if (profilePictureInput && profilePictureInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    updatedUser.profilePicture = event.target.result;
                    saveUserData(updatedUser);
                };
                reader.readAsDataURL(profilePictureInput.files[0]);
            } else {
                saveUserData(updatedUser);
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

function saveUserData(updatedUser) {
    try {
        // Update current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('Account information updated successfully.');
        window.location.href = 'settings.html';
    } catch (error) {
        console.error('Error saving user data:', error);
        alert('Failed to update account information. Please try again.');
    }
}