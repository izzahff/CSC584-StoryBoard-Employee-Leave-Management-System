// Leave Types Page JavaScript

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
    
    // Initialize leave types in localStorage if not exists
    if (!localStorage.getItem('leaveTypes')) {
        const defaultLeaveTypes = [
            {
                id: 'lt1',
                name: 'Annual Leave',
                description: 'Regular paid time off for vacation and personal matters',
                defaultDays: 21,
                isActive: true
            },
            {
                id: 'lt2',
                name: 'Sick Leave',
                description: 'Leave for medical reasons and health-related appointments',
                defaultDays: 14,
                isActive: true
            },
            {
                id: 'lt3',
                name: 'Maternity Leave',
                description: 'Leave for female employees before and after childbirth',
                defaultDays: 90,
                isActive: true
            }
        ];
        localStorage.setItem('leaveTypes', JSON.stringify(defaultLeaveTypes));
    }
    
    // Initialize the page
    initLeaveTypesPage();
});

function initLeaveTypesPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Display leave types
    displayLeaveTypes();
    
    // Setup event listeners
    setupEventListeners();
}

function displayLeaveTypes() {
    const leaveTypesTable = document.getElementById('leaveTypesTable');
    if (!leaveTypesTable) return;
    
    const leaveTypes = JSON.parse(localStorage.getItem('leaveTypes') || '[]');
    
    leaveTypesTable.innerHTML = leaveTypes.map(type => `
        <tr>
            <td>${type.name}</td>
            <td>${type.description || ''}</td>
            <td>
                <span class="status-badge ${type.isActive ? 'active' : 'inactive'}">
                    ${type.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary action-btn" onclick="editLeaveType('${type.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-${type.isActive ? 'warning' : 'success'} action-btn" onclick="toggleLeaveType('${type.id}')">
                        <i class="fas fa-${type.isActive ? 'toggle-off' : 'toggle-on'}"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Add new leave type button
    const addLeaveTypeBtn = document.querySelector('.admin-card-header .btn');
    if (addLeaveTypeBtn) {
        addLeaveTypeBtn.addEventListener('click', () => {
            window.location.href = 'add-leave-type.html';
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
window.editLeaveType = function(typeId) {
    // Store the ID for editing
    localStorage.setItem('editLeaveTypeId', typeId);
    window.location.href = 'edit-leave-type.html';
};

window.toggleLeaveType = function(typeId) {
    const leaveTypes = JSON.parse(localStorage.getItem('leaveTypes'));
    const leaveType = leaveTypes.find(type => type.id === typeId);
    
    if (leaveType) {
        const action = leaveType.isActive ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this leave type?`)) {
            leaveType.isActive = !leaveType.isActive;
            localStorage.setItem('leaveTypes', JSON.stringify(leaveTypes));
            displayLeaveTypes();
            alert(`Leave type ${action}d successfully`);
        }
    }
};