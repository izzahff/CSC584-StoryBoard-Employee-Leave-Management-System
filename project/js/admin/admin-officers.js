// Admin Officers Page JavaScript

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
    initAdminOfficersPage();
});

// Initialize admin officers page
async function initAdminOfficersPage() {
    loadAdminOfficers();
    setupEventListeners();
    loadUserProfile();
}

// Load admin officers from localStorage
function loadAdminOfficers() {
    try {
        const adminOfficers = JSON.parse(localStorage.getItem('adminOfficers') || '[]');
        displayAdminOfficers(adminOfficers);
    } catch (error) {
        console.error('Error loading admin officers:', error.message);
        alert('Failed to load admin officers. Please try again.');
    }
}

// Display admin officers in the table
function displayAdminOfficers(adminOfficers) {
    const adminOfficersTable = document.getElementById('adminOfficersTable');
    if (!adminOfficersTable) return;
    
    adminOfficersTable.innerHTML = adminOfficers.map(admin => `
        <tr>
            <td>${admin.id}</td>
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.phone || 'N/A'}</td>
            <td>
                <span class="status-badge ${admin.status.toLowerCase()}">
                    ${admin.status}
                </span>
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

// Set up event listeners
function setupEventListeners() {
    // Add new admin button
    const addAdminBtn = document.querySelector('.admin-card-header .btn');
    if (addAdminBtn) {
        addAdminBtn.addEventListener('click', () => {
            window.location.href = 'add-admin.html';
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
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

// Handle search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.getElementById('adminOfficersTable').getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Make functions available globally
window.editAdmin = function(adminId) {
    // Store the ID for editing
    localStorage.setItem('editAdminId', adminId);
    window.location.href = 'edit-admin.html';
};

window.deleteAdmin = function(adminId) {
    if (confirm('Are you sure you want to delete this admin officer?')) {
        try {
            const adminOfficers = JSON.parse(localStorage.getItem('adminOfficers'));
            const updatedAdminOfficers = adminOfficers.filter(admin => admin.id !== adminId);
            localStorage.setItem('adminOfficers', JSON.stringify(updatedAdminOfficers));
            loadAdminOfficers();
            alert('Admin officer deleted successfully');
        } catch (error) {
            console.error('Error deleting admin:', error.message);
            alert('Failed to delete admin officer. Please try again.');
        }
    }
};

// Load user profile
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = document.getElementById('userName');
    
    if (userName && currentUser) {
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}