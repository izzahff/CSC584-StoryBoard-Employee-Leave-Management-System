// Add Admin Officer Page JavaScript
import { supabase } from '../supabaseClient.js';

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
    initAddAdminPage();
});

function initAddAdminPage() {
    // Update header user info
    const userNameElement = document.getElementById('userName');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    // Setup form submission
    setupForm();
    
    // Setup other event listeners
    setupEventListeners();
}

function setupForm() {
    const form = document.getElementById('addAdminForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const adminId = document.getElementById('adminId').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            try {
                // Create auth user
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: 'admin'
                        }
                    }
                });
                
                if (authError) throw authError;
                
                // Create admin officer record
                const { error: adminError } = await supabase
                    .from('admin_officers')
                    .insert([
                        {
                            id: adminId,
                            email,
                            status: 'active'
                        }
                    ]);
                
                if (adminError) throw adminError;
                
                alert('Admin officer added successfully');
                window.location.href = 'admin-officers.html';
            } catch (error) {
                console.error('Error adding admin officer:', error.message);
                alert('Failed to add admin officer. Please try again.');
            }
        });
    }
}

function setupEventListeners() {
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