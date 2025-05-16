// Leave application functionality

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
    
    // Handle duration type change
    const durationType = document.getElementById('durationType');
    const shiftGroup = document.getElementById('shiftGroup');
    const endDate = document.getElementById('endDate');
    
    if (durationType) {
        durationType.addEventListener('change', function() {
            if (this.value === 'half') {
                shiftGroup.style.display = 'block';
                endDate.value = document.getElementById('startDate').value;
                endDate.disabled = true;
            } else {
                shiftGroup.style.display = 'none';
                endDate.disabled = false;
            }
        });
    }
    
    // Handle file uploads
    const fileInput = document.getElementById('attachments');
    const fileList = document.getElementById('fileList');
    
    if (fileInput && fileList) {
        fileInput.addEventListener('change', function() {
            // Clear the file list
            fileList.innerHTML = '';
            
            // Display selected files
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span>${file.name}</span>
                    <small>(${formatFileSize(file.size)})</small>
                `;
                fileList.appendChild(fileItem);
            }
        });
    }
    
    // Handle leave application form submission
    const leaveApplicationForm = document.getElementById('leaveApplicationForm');
    
    if (leaveApplicationForm) {
        leaveApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const leaveType = document.getElementById('leaveType').value;
            const leaveReason = document.getElementById('leaveReason').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const durationType = document.getElementById('durationType').value;
            const shift = document.getElementById('shift').value;
            const leaveDescription = document.getElementById('leaveDescription').value;
            
            // Validate dates
            if (new Date(startDate) > new Date(endDate)) {
                alert('End date cannot be before start date.');
                return;
            }
            
            // Calculate number of days
            let days = calculateDays(startDate, endDate);
            
            // Adjust days for half-day leave
            if (durationType === 'half') {
                days = 0.5;
            }
            
            // Check if user has enough leave balance
            if (days > user.leaveBalance) {
                alert(`Not enough leave balance. You have ${user.leaveBalance} days available.`);
                return;
            }
            
            // Create new leave application
            const newLeave = {
                id: generateId(),
                leaveType,
                leaveReason,
                startDate,
                endDate,
                durationType,
                shift: durationType === 'half' ? shift : null,
                days,
                description: leaveDescription,
                attachments: fileInput ? Array.from(fileInput.files).map(f => f.name) : [],
                status: 'pending',
                appliedDate: new Date().toISOString().split('T')[0]
            };
            
            // Add to user's leave history
            if (!user.leaveHistory) {
                user.leaveHistory = [];
            }
            user.leaveHistory.push(newLeave);
            
            // Update user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update users array
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex] = user;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Show success message and redirect
            alert('Leave application submitted successfully.');
            window.location.href = 'profile.html';
        });
    }
    
    // Handle save draft button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Get form values
            const leaveType = document.getElementById('leaveType').value;
            const leaveReason = document.getElementById('leaveReason').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const durationType = document.getElementById('durationType').value;
            const shift = document.getElementById('shift').value;
            const leaveDescription = document.getElementById('leaveDescription').value;
            
            // Create draft object
            const draft = {
                leaveType,
                leaveReason,
                startDate,
                endDate,
                durationType,
                shift,
                description: leaveDescription
            };
            
            // Save draft to localStorage
            localStorage.setItem('leaveDraft', JSON.stringify(draft));
            
            alert('Draft saved successfully.');
        });
    }
    
    // Handle cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                window.location.href = 'profile.html';
            }
        });
    }
    
    // Load draft if exists
    const leaveDraft = localStorage.getItem('leaveDraft');
    if (leaveDraft) {
        const draft = JSON.parse(leaveDraft);
        
        // Populate form with draft values
        if (document.getElementById('leaveType')) document.getElementById('leaveType').value = draft.leaveType || '';
        if (document.getElementById('leaveReason')) document.getElementById('leaveReason').value = draft.leaveReason || '';
        if (document.getElementById('startDate')) document.getElementById('startDate').value = draft.startDate || '';
        if (document.getElementById('endDate')) document.getElementById('endDate').value = draft.endDate || '';
        if (document.getElementById('durationType')) {
            document.getElementById('durationType').value = draft.durationType || 'full';
            if (draft.durationType === 'half') {
                document.getElementById('shiftGroup').style.display = 'block';
                document.getElementById('endDate').disabled = true;
            }
        }
        if (document.getElementById('shift')) document.getElementById('shift').value = draft.shift || 'am';
        if (document.getElementById('leaveDescription')) document.getElementById('leaveDescription').value = draft.description || '';
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

    // Add print functionality
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            // Get form values
            const leaveType = document.getElementById('leaveType').value;
            const leaveReason = document.getElementById('leaveReason').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const durationType = document.getElementById('durationType').value;
            const shift = document.getElementById('shift').value;
            const description = document.getElementById('leaveDescription').value;
            const files = document.getElementById('attachments').files;
            
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
                        <p><span class="label">Leave Type:</span> ${leaveType}</p>
                        <p><span class="label">Leave Reason:</span> ${leaveReason}</p>
                        <p><span class="label">Start Date:</span> ${new Date(startDate).toLocaleDateString()}</p>
                        <p><span class="label">End Date:</span> ${new Date(endDate).toLocaleDateString()}</p>
                        <p><span class="label">Duration Type:</span> ${durationType === 'half' ? 'Half Day' : 'Full Day'}</p>
                        ${durationType === 'half' ? `<p><span class="label">Shift:</span> ${shift === 'am' ? 'Morning' : 'Afternoon'}</p>` : ''}
                        <p><span class="label">Total Days:</span> ${durationType === 'half' ? '0.5' : calculateDays(startDate, endDate)}</p>
                        ${description ? `<p><span class="label">Description:</span> ${description}</p>` : ''}
                        ${files.length > 0 ? `<p><span class="label">Attachments:</span> ${Array.from(files).map(f => f.name).join(', ')}</p>` : ''}
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
            
            // Open print window
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
        });
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Helper function to calculate days between two dates
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
    return diffDays;
}