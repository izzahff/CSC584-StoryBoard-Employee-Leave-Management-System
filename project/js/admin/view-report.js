// View Report Page JavaScript

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
    initReportPage();
});

function initReportPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Initialize filter dropdowns
    initializeFilters();
    
    // Load and display report data
    loadReportData();
    
    // Setup event listeners
    setupEventListeners();
}

function initializeFilters() {
    // Set default date range (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('dateFrom').value = firstDay.toISOString().split('T')[0];
    document.getElementById('dateTo').value = lastDay.toISOString().split('T')[0];
    
    // Populate employee filter
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employeeFilter = document.getElementById('employeeFilter');
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.name;
        employeeFilter.appendChild(option);
    });
    
    // Populate leave type filter
    const leaveTypes = JSON.parse(localStorage.getItem('leaveTypes') || '[]');
    const leaveTypeFilter = document.getElementById('leaveTypeFilter');
    leaveTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name;
        leaveTypeFilter.appendChild(option);
    });
}

function loadReportData() {
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const filteredRequests = applyFilters(leaveRequests);
    displayReport(filteredRequests);
}

function applyFilters(requests) {
    const dateFrom = new Date(document.getElementById('dateFrom').value);
    const dateTo = new Date(document.getElementById('dateTo').value);
    const employeeId = document.getElementById('employeeFilter').value;
    const leaveType = document.getElementById('leaveTypeFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    return requests.filter(request => {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        
        const dateMatch = startDate >= dateFrom && endDate <= dateTo;
        const employeeMatch = !employeeId || request.employeeId === employeeId;
        const leaveTypeMatch = !leaveType || request.leaveType === leaveType;
        const statusMatch = !status || request.status === status;
        
        return dateMatch && employeeMatch && leaveTypeMatch && statusMatch;
    });
}

function displayReport(requests) {
    const reportTable = document.getElementById('reportTable');
    if (!reportTable) return;
    
    reportTable.innerHTML = requests.map(request => `
        <tr>
            <td>${request.id}</td>
            <td>${request.employeeName}</td>
            <td>${request.leaveType}</td>
            <td>${request.duration}</td>
            <td>${formatDate(request.startDate)}</td>
            <td>${formatDate(request.endDate)}</td>
            <td>
                <span class="status-badge ${request.status}">${request.status}</span>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', loadReportData);
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset date range to current month
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            document.getElementById('dateFrom').value = firstDay.toISOString().split('T')[0];
            document.getElementById('dateTo').value = lastDay.toISOString().split('T')[0];
            
            // Reset other filters
            document.getElementById('employeeFilter').value = '';
            document.getElementById('leaveTypeFilter').value = '';
            document.getElementById('statusFilter').value = '';
            
            // Reload data
            loadReportData();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
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

function exportReport() {
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const filteredRequests = applyFilters(leaveRequests);
    
    // Create CSV content
    const csvContent = [
        ['ID', 'Employee Name', 'Leave Type', 'Days', 'Start Date', 'End Date', 'Status'],
        ...filteredRequests.map(request => [
            request.id,
            request.employeeName,
            request.leaveType,
            request.duration,
            formatDate(request.startDate),
            formatDate(request.endDate),
            request.status
        ])
    ].map(row => row.join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_report_${formatDate(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}