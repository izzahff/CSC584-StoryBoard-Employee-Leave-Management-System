// Leave history page functionality

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
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    // Initialize filters
    const filterYear = document.getElementById('filterYear');
    const filterStatus = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    // Set current year as default
    if (filterYear) {
        const currentYear = new Date().getFullYear();
        filterYear.value = currentYear.toString();
    }
    
    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 5;
    let filteredLeaves = [];
    
    // Add event listeners to filters
    if (filterYear) {
        filterYear.addEventListener('change', loadLeaveHistory);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', loadLeaveHistory);
    }
    
    if (filterType) {
        filterType.addEventListener('change', loadLeaveHistory);
    }
    
    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (filterYear) filterYear.value = 'all';
            if (filterStatus) filterStatus.value = 'all';
            if (filterType) filterType.value = 'all';
            
            loadLeaveHistory();
        });
    }
    
    // Pagination buttons
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayLeaveHistory(filteredLeaves, currentPage);
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredLeaves.length / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayLeaveHistory(filteredLeaves, currentPage);
            }
        });
    }

    // Load leave history after all elements are initialized
    loadLeaveHistory();
    
    // Function to load leave history with filters
    function loadLeaveHistory() {
        const leaveHistory = user.leaveHistory || [];
        
        // Apply filters
        filteredLeaves = leaveHistory.filter(leave => {
            // Year filter
            const yearFilter = filterYear ? filterYear.value : 'all';
            const leaveYear = new Date(leave.startDate).getFullYear().toString();
            const yearMatch = yearFilter === 'all' || leaveYear === yearFilter;
            
            // Status filter
            const statusFilter = filterStatus ? filterStatus.value : 'all';
            const statusMatch = statusFilter === 'all' || leave.status === statusFilter;
            
            // Type filter
            const typeFilter = filterType ? filterType.value : 'all';
            const typeMatch = typeFilter === 'all' || leave.leaveType === typeFilter;
            
            return yearMatch && statusMatch && typeMatch;
        });
        
        // Sort by applied date (most recent first)
        filteredLeaves.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        
        // Reset to first page when filters change
        currentPage = 1;
        
        // Display filtered results
        displayLeaveHistory(filteredLeaves, currentPage);
    }
    
    // Function to display leave history with pagination
    function displayLeaveHistory(leaves, page) {
        const tableBody = document.getElementById('leaveHistoryTable');
        if (!tableBody) return;
        
        // Clear existing table rows
        tableBody.innerHTML = '';
        
        // Calculate start and end index for pagination
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, leaves.length);
        
        // Create table rows
        if (leaves.length === 0) {
            // If no leave history, show a message
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="8" class="text-center">No leave applications found.</td>
            `;
            tableBody.appendChild(row);
        } else {
            for (let i = startIndex; i < endIndex; i++) {
                const leave = leaves[i];
                const row = document.createElement('tr');
                
                const statusClass = 
                    leave.status === 'pending' ? 'status-pending' :
                    leave.status === 'approved' ? 'status-approved' :
                    leave.status === 'rejected' ? 'status-rejected' : 'status-cancelled';
                
                row.innerHTML = `
                    <td>${leave.id.substring(0, 8)}</td>
                    <td>${capitalizeFirstLetter(leave.leaveType)}</td>
                    <td>${formatDate(leave.startDate)}</td>
                    <td>${formatDate(leave.endDate)}</td>
                    <td>${leave.days} days</td>
                    <td>${formatDate(leave.appliedDate)}</td>
                    <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(leave.status)}</span></td>
                    <td>
                        <button class="btn btn-primary action-btn view-btn" data-id="${leave.id}">View</button>
                        <button class="btn btn-secondary action-btn print-btn" data-id="${leave.id}">
                            <i class="fas fa-print"></i>
                        </button>
                        ${leave.status === 'pending' ? `<button class="btn btn-danger action-btn cancel-btn" data-id="${leave.id}">Cancel</button>` : ''}
                    </td>
                `;
                
                tableBody.appendChild(row);
            }
        }
        
        // Update pagination controls
        const totalPages = Math.ceil(leaves.length / rowsPerPage);
        const currentPageElement = document.getElementById('currentPage');
        if (currentPageElement) {
            currentPageElement.textContent = `Page ${page} of ${totalPages || 1}`;
        }
        
        // Enable/disable pagination buttons
        if (prevPageBtn) {
            prevPageBtn.disabled = page <= 1;
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = page >= totalPages;
        }
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const leaveId = this.getAttribute('data-id');
                viewLeaveDetails(leaveId);
            });
        });
        
        document.querySelectorAll('.print-btn').forEach(button => {
            button.addEventListener('click', function() {
                const leaveId = this.getAttribute('data-id');
                const leave = user.leaveHistory.find(l => l.id === leaveId);
                if (leave) {
                    printLeaveApplication(leave);
                }
            });
        });
        
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', function() {
                const leaveId = this.getAttribute('data-id');
                cancelLeaveRequest(leaveId);
            });
        });
    }
    
    // Function to print leave application
    function printLeaveApplication(leave) {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow pop-ups to print the leave application.');
            return;
        }
        
        // Create print window content
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
                    .signature-line {
                        border-top: 1px solid #000;
                        width: 200px;
                        margin-top: 50px;
                        display: inline-block;
                    }
                    .signature-box {
                        margin: 30px 0;
                        display: flex;
                        justify-content: space-between;
                    }
                    .status {
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-weight: bold;
                        display: inline-block;
                    }
                    .status-pending { background: #ffeaa7; color: #d69e2e; }
                    .status-approved { background: #c6f6d5; color: #2f855a; }
                    .status-rejected { background: #fed7d7; color: #c53030; }
                    .status-cancelled { background: #e2e8f0; color: #718096; }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="img/logo.png" alt="IMNSB Logo" class="logo">
                    <div class="company-name">IMNSB</div>
                    <div>Employee Leave Management System</div>
                </div>
                
                <h2 class="title">Leave Application Form</h2>
                
                <div class="section">
                    <p><span class="label">Employee Name:</span> ${user.firstName} ${user.lastName}</p>
                    <p><span class="label">Employee ID:</span> ${user.employeeId}</p>
                    <p><span class="label">Department:</span> ${user.department}</p>
                    <p><span class="label">Position:</span> ${user.position}</p>
                </div>
                
                <div class="section">
                    <p><span class="label">Application ID:</span> ${leave.id}</p>
                    <p><span class="label">Leave Type:</span> ${capitalizeFirstLetter(leave.leaveType)}</p>
                    <p><span class="label">Leave Reason:</span> ${capitalizeFirstLetter(leave.leaveReason)}</p>
                    <p><span class="label">Start Date:</span> ${formatDate(leave.startDate)}</p>
                    <p><span class="label">End Date:</span> ${formatDate(leave.endDate)}</p>
                    <p><span class="label">Duration Type:</span> ${leave.durationType === 'half' ? 'Half Day' : 'Full Day'}</p>
                    ${leave.durationType === 'half' ? `<p><span class="label">Shift:</span> ${leave.shift === 'am' ? 'Morning' : 'Afternoon'}</p>` : ''}
                    <p><span class="label">Total Days:</span> ${leave.days}</p>
                    <p><span class="label">Applied On:</span> ${formatDate(leave.appliedDate)}</p>
                    <p><span class="label">Status:</span> <span class="status status-${leave.status}">${capitalizeFirstLetter(leave.status)}</span></p>
                    ${leave.description ? `<p><span class="label">Description:</span> ${leave.description}</p>` : ''}
                    ${leave.attachments && leave.attachments.length > 0 ? `<p><span class="label">Attachments:</span> ${leave.attachments.join(', ')}</p>` : ''}
                </div>
                
                <div class="signature-box">
                    <div>
                        <div class="signature-line"></div>
                        <p>Employee Signature</p>
                    </div>
                    <div>
                        <div class="signature-line"></div>
                        <p>Manager Approval</p>
                    </div>
                </div>
                
                <button class="no-print" onclick="window.print()">Print</button>
                <button class="no-print" onclick="window.close()">Close</button>
            </body>
            </html>
        `;
        
        // Write content to print window
        printWindow.document.write(printContent);
        printWindow.document.close();
    }
    
    // Function to view leave details
    function viewLeaveDetails(leaveId) {
        const leave = user.leaveHistory.find(leave => leave.id === leaveId);
        if (!leave) return;
        
        // Create a modal to display leave details
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Leave Details</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="leave-detail">
                        <span class="detail-label">Leave Type:</span>
                        <span class="detail-value">${capitalizeFirstLetter(leave.leaveType)}</span>
                    </div>
                    <div class="leave-detail">
                        <span class="detail-label">Reason:</span>
                        <span class="detail-value">${capitalizeFirstLetter(leave.leaveReason)}</span>
                    </div>
                    <div class="leave-detail">
                        <span class="detail-label">Start Date:</span>
                        <span class="detail-value">${formatDate(leave.startDate)}</span>
                    </div>
                    <div class="leave-detail">
                        <span class="detail-label">End Date:</span>
                        <span class="detail-value">${formatDate(leave.endDate)}</span>
                    </div>
                    <div class="leave-detail">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${leave.days} days</span>
                    </div>
                    <div class="leave-detail">
                        <span class="detail-label">Applied On:</span>
                        <span class="detail-value">${formatDate(leave.appliedDate)}</span>
                    </div>
                    <div class="leave-detail">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value status-badge ${leave.status === 'pending' ? 'status-pending' : leave.status === 'approved' ? 'status-approved' : leave.status === 'rejected' ? 'status-rejected' : 'status-cancelled'}">${capitalizeFirstLetter(leave.status)}</span>
                    </div>
                    ${leave.description ? `
                    <div class="leave-detail">
                        <span class="detail-label">Description:</span>
                        <p class="detail-value description">${leave.description}</p>
                    </div>
                    ` : ''}
                    ${leave.attachments && leave.attachments.length > 0 ? `
                    <div class="leave-detail">
                        <span class="detail-label">Attachments:</span>
                        <ul class="attachments-list">
                            ${leave.attachments.map(attachment => `<li>${attachment}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-btn">Close</button>
                    <button class="btn btn-secondary print-btn" data-id="${leave.id}">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                animation: modalFadeIn 0.3s ease-out;
            }
            
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .modal-header h3 {
                margin: 0;
            }
            
            .close-modal {
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #e0e0e0;
                text-align: right;
            }
            
            .leave-detail {
                margin-bottom: 1rem;
            }
            
            .detail-label {
                font-weight: 600;
                display: inline-block;
                min-width: 120px;
                color: #6c757d;
            }
            
            .detail-value {
                color: #333;
            }
            
            .description {
                margin-top: 0.5rem;
                background-color: #f8f9fa;
                padding: 0.8rem;
                border-radius: 4px;
                white-space: pre-line;
            }
            
            .attachments-list {
                margin-top: 0.5rem;
                padding-left: 1.5rem;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Close modal function
        const closeModal = () => {
            modal.remove();
            style.remove();
        };
        
        // Add event listeners to close the modal
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.close-btn').addEventListener('click', closeModal);
        
        // Add event listener to print button
        modal.querySelector('.print-btn').addEventListener('click', function() {
            const leaveId = this.getAttribute('data-id');
            const leave = user.leaveHistory.find(l => l.id === leaveId);
            if (leave) {
                printLeaveApplication(leave);
            }
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Function to cancel a leave request
    function cancelLeaveRequest(leaveId) {
        // Confirm before cancelling
        if (!confirm('Are you sure you want to cancel this leave request?')) {
            return;
        }
        
        // Find the leave request
        const leaveIndex = user.leaveHistory.findIndex(leave => leave.id === leaveId);
        if (leaveIndex === -1) return;
        
        // Update leave status to cancelled
        user.leaveHistory[leaveIndex].status = 'cancelled';
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Refresh the leave history
        loadLeaveHistory();
        
        alert('Leave request cancelled successfully.');
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

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}