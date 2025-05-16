// View Leave Request Page JavaScript

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
    initViewRequestPage();
});

function initViewRequestPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Load request details
    loadRequestDetails();
    
    // Setup event listeners
    setupEventListeners();
}

function loadRequestDetails() {
    // Get request ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    
    if (!requestId) {
        alert('No request ID provided');
        window.location.href = 'leave-requests.html';
        return;
    }
    
    // Get leave requests from localStorage
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const request = leaveRequests.find(r => r.id === requestId);
    
    if (!request) {
        alert('Leave request not found');
        window.location.href = 'leave-requests.html';
        return;
    }
    
    // Update page with request details
    document.getElementById('requestId').textContent = request.id;
    document.getElementById('employeeName').textContent = request.employeeName;
    document.getElementById('leaveType').textContent = request.leaveType;
    document.getElementById('startDate').textContent = formatDate(request.startDate);
    document.getElementById('endDate').textContent = formatDate(request.endDate);
    document.getElementById('duration').textContent = `${request.duration} days`;
    document.getElementById('status').innerHTML = `<span class="status-badge ${request.status}">${request.status}</span>`;
    document.getElementById('appliedDate').textContent = formatDate(request.appliedDate);
    document.getElementById('reason').textContent = request.reason;

    // Handle attachments
    if (request.attachments && request.attachments.length > 0) {
        const attachmentsGroup = document.getElementById('attachmentsGroup');
        const attachmentsList = document.querySelector('.attachments-list');
        
        attachmentsGroup.style.display = 'flex';
        attachmentsList.innerHTML = request.attachments.map(attachment => `
            <div class="attachment-item">
                <i class="fas fa-file"></i>
                <a href="#" onclick="viewAttachment('${attachment}'); return false;">${attachment}</a>
            </div>
        `).join('');
    }
}

function setupEventListeners() {
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', handlePrint);
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

function handlePrint() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    
    if (!requestId) return;
    
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const request = leaveRequests.find(r => r.id === requestId);
    
    if (!request) return;
    
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
                .attachments {
                    margin-top: 10px;
                }
                .attachment-item {
                    margin: 5px 0;
                }
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
                ${request.attachments && request.attachments.length > 0 ? `
                <div class="attachments">
                    <p><span class="label">Supporting Documents:</span></p>
                    ${request.attachments.map(attachment => `
                        <div class="attachment-item">- ${attachment}</div>
                    `).join('')}
                </div>
                ` : ''}
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

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

// Make functions available globally
window.viewAttachment = function(filename) {
    // In a real application, this would open or download the actual file
    alert(`Viewing attachment: ${filename}\n\nIn a production environment, this would open or download the actual file.`);
};