// Add Approval Manager Page JavaScript
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
    initAddManagerPage();
});

function initAddManagerPage() {
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
    const form = document.getElementById('addManagerForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const managerId = document.getElementById('managerId').value;
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
                            role: 'manager'
                        }
                    }
                });
                
                if (authError) throw authError;
                
                // Create approval manager record
                const { error: managerError } = await supabase
                    .from('approval_managers')
                    .insert([
                        {
                            id: managerId,
                            email,
                            status: 'active'
                        }
                    ]);
                
                if (managerError) throw managerError;
                
                alert('Approval manager added successfully');
                window.location.href = 'approval-managers.html';
            } catch (error) {
                console.error('Error adding approval manager:', error.message);
                alert('Failed to add approval manager. Please try again.');
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