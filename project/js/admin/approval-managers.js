// Approval Managers Page JavaScript

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

    // Initialize managers in localStorage if not exists
    if (!localStorage.getItem('managers')) {
        const defaultManagers = [
            {
                id: 'mgr1',
                name: 'David Wilson',
                email: 'david.wilson@imnsb.com',
                status: 'active'
            },
            {
                id: 'mgr2',
                name: 'Emily Davis',
                email: 'emily.davis@imnsb.com',
                status: 'active'
            },
            {
                id: 'mgr3',
                name: 'James Anderson',
                email: 'james.anderson@imnsb.com',
                status: 'active'
            }
        ];
        localStorage.setItem('managers', JSON.stringify(defaultManagers));
    }
    
    // Initialize the page
    initManagersPage();
});

function initManagersPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Display managers
    displayManagers();
    
    // Setup event listeners
    setupEventListeners();
}

function displayManagers() {
    const managersTable = document.getElementById('managersTable');
    if (!managersTable) return;
    
    const managers = JSON.parse(localStorage.getItem('managers') || '[]');
    
    managersTable.innerHTML = managers.map(manager => `
        <tr>
            <td>${manager.id}</td>
            <td>${manager.name}</td>
            <td>${manager.email}</td>
            <td>
                <span class="status-badge ${manager.status}">${manager.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary action-btn" onclick="editManager('${manager.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger action-btn" onclick="deleteManager('${manager.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Add new manager button
    const addManagerBtn = document.querySelector('.admin-card-header .btn');
    if (addManagerBtn) {
        addManagerBtn.addEventListener('click', () => {
            window.location.href = 'add-manager.html';
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.getElementById('managersTable').getElementsByTagName('tr');
            
            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
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

// Make functions available globally
window.editManager = function(managerId) {
    // Store the ID for editing
    localStorage.setItem('editManagerId', managerId);
    window.location.href = 'edit-manager.html';
};

window.deleteManager = function(managerId) {
    if (confirm('Are you sure you want to delete this manager?')) {
        try {
            const managers = JSON.parse(localStorage.getItem('managers'));
            const updatedManagers = managers.filter(manager => manager.id !== managerId);
            localStorage.setItem('managers', JSON.stringify(updatedManagers));
            displayManagers();
            alert('Manager deleted successfully');
        } catch (error) {
            console.error('Error deleting manager:', error.message);
            alert('Failed to delete manager. Please try again.');
        }
    }
};