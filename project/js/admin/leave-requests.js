// Leave Requests Page JavaScript

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
    
    // Initialize leave requests in localStorage if not exists
    if (!localStorage.getItem('leaveRequests')) {
        const defaultLeaveRequests = [
            {
                id: 'lr1',
                employeeId: 'emp1',
                employeeName: 'Robert Taylor',
                leaveType: 'Annual Leave',
                startDate: '2025-05-20',
                endDate: '2025-05-24',
                duration: 5,
                status: 'pending',
                appliedDate: '2025-05-15',
                reason: 'Family vacation'
            },
            {
                id: 'lr2',
                employeeId: 'emp2',
                employeeName: 'Jennifer White',
                leaveType: 'Sick Leave',
                startDate: '2025-05-18',
                endDate: '2025-05-19',
                duration: 2,
                status: 'approved',
                appliedDate: '2025-05-16',
                reason: 'Medical appointment'
            }
        ];
        localStorage.setItem('leaveRequests', JSON.stringify(defaultLeaveRequests));
    }
    
    // Initialize the page
    initLeaveRequestsPage();
});

function initLeaveRequestsPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Display leave requests
    displayLeaveRequests();
    
    // Setup event listeners
    setupEventListeners();
}

function displayLeaveRequests() {
    const leaveRequestsTable = document.getElementById('leaveRequestsTable');
    if (!leaveRequestsTable) return;
    
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    
    leaveRequestsTable.innerHTML = leaveRequests.map(request => `
        <tr>
            <td>${request.id}</td>
            <td>${request.employeeName}</td>
            <td>${request.leaveType}</td>
            <td>${formatDate(request.startDate)}</td>
            <td>${formatDate(request.endDate)}</td>
            <td>${request.duration} days</td>
            <td>
                <span class="status-badge ${request.status}">${request.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <a href="view-leave-request.html?id=${request.id}" class="btn btn-primary action-btn">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="btn btn-secondary action-btn" onclick="printRequest('${request.id}')">
                        <i class="fas fa-print"></i>
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
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.getElementById('leaveRequestsTable').getElementsByTagName('tr');
            
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

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

// Make functions available globally
window.printRequest = function(requestId) {
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests'));
    const request = leaveRequests.find(r => r.id === requestId);
    
    if (request) {
        const printWindow = window.open('', '_blank');
        
        const printContent = `
            <html>
            <head>
                <title>Leave Application</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .logo {
                        max-width: 100px;
                        margin-bottom: 10px;
                    }
                    .company-name {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 10px 0;
                    }
                    .title {
                        font-size: 20px;
                        margin: 20px 0;
                        text-align: center;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .label {
                        font-weight: bold;
                        min-width: 150px;
                        display: inline-block;
                    }
                    .signature-section {
                        margin-top: 50px;
                    }
                    .signature-box {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 50px;
                    }
                    .signature {
                        text-align: center;
                    }
                    .signature-line {
                        width: 200px;
                        border-top: 1px solid #000;
                        margin-bottom: 10px;
                    }
                    .status {
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-weight: bold;
                    }
                    .status.pending { background: #ffeaa7; color: #d69e2e; }
                    .status.approved { background: #c6f6d5; color: #2f855a; }
                    .status.rejected { background: #fed7d7; color: #c53030; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="../img/logo.png" alt="IMNSB Logo" class="logo">
                    <div class="company-name">IMNSB</div>
                    <div>Employee Leave Management System</div>
                </div>
                
                <h2 class="title">Leave Application Form</h2>
                
                <div class="section">
                    <p><span class="label">Request ID:</span> ${request.id}</p>
                    <p><span class="label">Employee Name:</span> ${request.employeeName}</p>
                    <p><span class="label">Leave Type:</span> ${request.leaveType}</p>
                    <p><span class="label">Start Date:</span> ${formatDate(request.startDate)}</p>
                    <p><span class="label">End Date:</span> ${formatDate(request.endDate)}</p>
                    <p><span class="label">Duration:</span> ${request.duration} days</p>
                    <p><span class="label">Status:</span> <span class="status ${request.status}">${request.status}</span></p>
                    <p><span class="label">Applied Date:</span> ${formatDate(request.appliedDate)}</p>
                    <p><span class="label">Reason:</span> ${request.reason}</p>
                </div>
                
                <div class="signature-box">
                    <div class="signature">
                        <div class="signature-line"></div>
                        <p>Employee Signature</p>
                    </div>
                    <div class="signature">
                        <div class="signature-line"></div>
                        <p>Manager Approval</p>
                    </div>
                </div>
                
                <div class="no-print" style="margin-top: 20px; text-align: center;">
                    <button onclick="window.print()">Print</button>
                    <button onclick="window.close()">Close</button>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
    }
};