// Admin Profile Page JavaScript

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

    // Initialize admin officers in localStorage if not exists
    if (!localStorage.getItem('adminOfficers')) {
        const defaultAdminOfficers = [
            {
                id: 'adm1',
                name: 'John Smith',
                email: 'john.smith@imnsb.com',
                phone: '+1234567890',
                status: 'active'
            },
            {
                id: 'adm2',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@imnsb.com',
                phone: '+1234567891',
                status: 'active'
            },
            {
                id: 'adm3',
                name: 'Michael Brown',
                email: 'michael.brown@imnsb.com',
                phone: '+1234567892',
                status: 'inactive'
            }
        ];
        localStorage.setItem('adminOfficers', JSON.stringify(defaultAdminOfficers));
    }
    
    // Initialize the page
    initAdminProfile();
});

function initAdminProfile() {
    loadUserProfile();
    displayAdminOfficers();
    setupEventListeners();
}

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update header user info
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Update profile information
    document.getElementById('profileId').textContent = currentUser.employeeId;
    document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    // Update avatar if exists
    const profileAvatar = document.getElementById('profileAvatar');
    const headerAvatar = document.querySelector('.user-avatar img');
    if (currentUser.profilePicture) {
        profileAvatar.src = currentUser.profilePicture;
        headerAvatar.src = currentUser.profilePicture;
    }
}

function displayAdminOfficers() {
    const adminOfficersTable = document.getElementById('adminOfficersTable');
    if (!adminOfficersTable) return;
    
    const adminOfficers = JSON.parse(localStorage.getItem('adminOfficers') || '[]');
    
    adminOfficersTable.innerHTML = adminOfficers.map(admin => `
        <tr>
            <td>${admin.id}</td>
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.phone || 'N/A'}</td>
            <td>
                <span class="status-badge ${admin.status}">${admin.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary action-btn" onclick="editAdmin('${admin.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger action-btn" onclick="deleteAdmin('${admin.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Add new admin
    const addAdminBtn = document.getElementById('addAdminBtn');
    if (addAdminBtn) {
        addAdminBtn.addEventListener('click', () => {
            window.location.href = 'add-admin.html';
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
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.getElementById('adminOfficersTable').getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}

// Make functions available globally
window.editAdmin = function(adminId) {
    localStorage.setItem('editAdminId', adminId);
    window.location.href = 'edit-admin.html';
};

window.deleteAdmin = function(adminId) {
    if (confirm('Are you sure you want to delete this admin officer?')) {
        try {
            const adminOfficers = JSON.parse(localStorage.getItem('adminOfficers'));
            const updatedAdminOfficers = adminOfficers.filter(admin => admin.id !== adminId);
            localStorage.setItem('adminOfficers', JSON.stringify(updatedAdminOfficers));
            displayAdminOfficers();
            alert('Admin officer deleted successfully');
        } catch (error) {
            console.error('Error deleting admin:', error.message);
            alert('Failed to delete admin officer. Please try again.');
        }
    }
};