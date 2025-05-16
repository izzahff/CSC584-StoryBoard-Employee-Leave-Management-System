// Authentication related functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 'ADM001',
                employeeId: 'ADM001',
                email: 'admin@imnsb.com',
                password: 'Admin@123',
                firstName: 'System',
                lastName: 'Admin',
                role: 'admin',
                phone: '+1234567890',
                joinDate: '2024-01-01'
            },
            {
                id: 'MGR001',
                employeeId: 'MGR001', 
                email: 'manager@imnsb.com',
                password: 'Manager@123',
                firstName: 'Project',
                lastName: 'Manager',
                role: 'manager',
                phone: '+1234567890',
                joinDate: '2024-01-01'
            },
            {
                id: 'EMP001',
                employeeId: 'EMP001',
                email: 'john.doe@imnsb.com',
                password: 'Employee@123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'employee',
                phone: '+1234567891',
                joinDate: '2024-01-15',
                leaveHistory: [
                    {
                        id: 'LR001',
                        leaveType: 'Annual Leave',
                        startDate: '2024-05-20',
                        endDate: '2024-05-24',
                        days: 5,
                        description: 'Family vacation',
                        status: 'pending',
                        appliedDate: '2024-05-15'
                    }
                ]
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Check for login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const employeeId = document.getElementById('employeeId').value;
            const password = document.getElementById('password').value;
            
            // Get role from URL path
            const role = window.location.pathname.includes('/manager/') ? 'manager' : 
                        window.location.pathname.includes('/admin/') ? 'admin' : 
                        'employee';
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Find user with matching credentials and role
            const user = users.find(u => 
                u.employeeId === employeeId && 
                u.password === password && 
                u.role === role
            );
            
            if (user) {
                // Store current user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect based on role
                switch (user.role) {
                    case 'manager':
                        window.location.href = 'profile.html';
                        break;
                    case 'admin':
                        window.location.href = 'profile.html';
                        break;
                    case 'employee':
                        window.location.href = '../profile.html';
                        break;
                    default:
                        window.location.href = '../profile.html';
                }
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }
    
    // Check for signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        // Handle multi-step form
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // Validate step 1 fields
                const employeeId = document.getElementById('employeeId').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                // Simple validation
                if (!employeeId || !email || !phone || !password || !confirmPassword) {
                    alert('Please fill in all fields.');
                    return;
                }
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match.');
                    return;
                }
                
                // Check if employee ID already exists
                const users = JSON.parse(localStorage.getItem('users'));
                const existingUser = users.find(u => u.employeeId === employeeId);
                
                if (existingUser) {
                    alert('Employee ID already exists. Please use a different ID or log in.');
                    return;
                }
                
                // Move to step 2
                step1.classList.remove('active');
                step2.classList.add('active');
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                // Move back to step 1
                step2.classList.remove('active');
                step1.classList.add('active');
            });
        }
        
        // Add submit event listener to signup form
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const employeeId = document.getElementById('employeeId').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            
            // Get role from URL path
            const role = window.location.pathname.includes('/manager/') ? 'manager' : 
                        window.location.pathname.includes('/admin/') ? 'admin' : 
                        'employee';
            
            // Create new user object
            const newUser = {
                id: generateId(),
                employeeId,
                email,
                phone,
                password,
                firstName,
                lastName,
                role,
                joinDate: new Date().toISOString().split('T')[0],
                leaveBalance: 21,
                leaveHistory: []
            };
            
            // Get existing users and add new user
            const users = JSON.parse(localStorage.getItem('users'));
            users.push(newUser);
            
            // Save updated users array
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Redirect based on role
            switch (role) {
                case 'manager':
                    window.location.href = 'profile.html';
                    break;
                case 'admin':
                    window.location.href = 'profile.html';
                    break;
                default:
                    window.location.href = '../profile.html';
            }
        });
    }
});

// Function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
}