// Edit account functionality

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
    const headerAvatar = document.getElementById('headerAvatar');
    const profilePreview = document.getElementById('profilePreview');
    
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    // Update avatar images if user has a profile picture
    if (user.profilePicture) {
        if (headerAvatar) headerAvatar.src = user.profilePicture;
        if (profilePreview) profilePreview.src = user.profilePicture;
    }
    
    // Handle profile picture upload
    const profilePictureInput = document.getElementById('profilePicture');
    if (profilePictureInput) {
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
                    if (profilePreview) profilePreview.src = imageData;
                    if (headerAvatar) headerAvatar.src = imageData;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Populate form with current user data
    const form = document.getElementById('editAccountForm');
    if (form) {
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const updatedUser = {
                ...user,
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
    
    // Function to save user data
    function saveUserData(updatedUser) {
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
        alert('Account information updated successfully.');
        window.location.href = 'settings.html';
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