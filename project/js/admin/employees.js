// Employees Page JavaScript

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

    // Initialize employees in localStorage if not exists
    if (!localStorage.getItem('employees')) {
        const defaultEmployees = [
            {
                id: 'emp1',
                name: 'Robert Taylor',
                email: 'robert.taylor@imnsb.com',
                status: 'active'
            },
            {
                id: 'emp2',
                name: 'Jennifer White',
                email: 'jennifer.white@imnsb.com',
                status: 'active'
            },
            {
                id: 'emp3',
                name: 'William Clark',
                email: 'william.clark@imnsb.com',
                status: 'active'
            }
        ];
        localStorage.setItem('employees', JSON.stringify(defaultEmployees));
    }
    
    // Initialize the page
    initEmployeesPage();
});

function initEmployeesPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Display employees
    displayEmployees();
    
    // Setup event listeners
    setupEventListeners();
}

function displayEmployees() {
    const employeesTable = document.getElementById('employeesTable');
    if (!employeesTable) return;
    
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    
    employeesTable.innerHTML = employees.map(employee => `
        <tr>
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>
                <span class="status-badge ${employee.status}">${employee.status}</span>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Add new employee button
    const addEmployeeBtn = document.querySelector('.admin-card-header .btn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', () => {
            window.location.href = 'add-employee.html';
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.getElementById('employeesTable').getElementsByTagName('tr');
            
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