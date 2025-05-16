// Mockup data for admin pages

export const adminOfficers = [
    {
        id: 'ADM001',
        name: 'John Smith',
        email: 'john.smith@imnsb.com',
        phone: '+1234567890',
        status: 'active'
    },
    {
        id: 'ADM002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@imnsb.com',
        phone: '+1234567891',
        status: 'active'
    },
    {
        id: 'ADM003',
        name: 'Michael Brown',
        email: 'michael.brown@imnsb.com',
        phone: '+1234567892',
        status: 'inactive'
    }
];

export const approvalManagers = [
    {
        id: 'MGR001',
        name: 'David Wilson',
        department: 'Human Resources',
        email: 'david.wilson@imnsb.com',
        status: 'active'
    },
    {
        id: 'MGR002',
        name: 'Emily Davis',
        department: 'Information Technology',
        email: 'emily.davis@imnsb.com',
        status: 'active'
    },
    {
        id: 'MGR003',
        name: 'James Anderson',
        department: 'Finance',
        email: 'james.anderson@imnsb.com',
        status: 'active'
    },
    {
        id: 'MGR004',
        name: 'Lisa Thompson',
        department: 'Marketing',
        email: 'lisa.thompson@imnsb.com',
        status: 'inactive'
    }
];

export const employees = [
    {
        id: 'EMP001',
        name: 'Robert Taylor',
        department: 'Human Resources',
        position: 'HR Specialist',
        email: 'robert.taylor@imnsb.com',
        status: 'active'
    },
    {
        id: 'EMP002',
        name: 'Jennifer White',
        department: 'Information Technology',
        position: 'Software Engineer',
        email: 'jennifer.white@imnsb.com',
        status: 'active'
    },
    {
        id: 'EMP003',
        name: 'William Clark',
        department: 'Finance',
        position: 'Financial Analyst',
        email: 'william.clark@imnsb.com',
        status: 'active'
    },
    {
        id: 'EMP004',
        name: 'Mary Martinez',
        department: 'Marketing',
        position: 'Marketing Coordinator',
        email: 'mary.martinez@imnsb.com',
        status: 'active'
    },
    {
        id: 'EMP005',
        name: 'Thomas Lee',
        department: 'Operations',
        position: 'Operations Manager',
        email: 'thomas.lee@imnsb.com',
        status: 'inactive'
    }
];

export const leaveTypes = [
    {
        id: 'LT001',
        name: 'Annual Leave',
        description: 'Regular paid time off for vacation and personal matters',
        isActive: true
    },
    {
        id: 'LT002',
        name: 'Sick Leave',
        description: 'Leave for medical reasons and health-related appointments',
        isActive: true
    },
    {
        id: 'LT003',
        name: 'Maternity Leave',
        description: 'Leave for female employees before and after childbirth',
        isActive: true
    },
    {
        id: 'LT004',
        name: 'Paternity Leave',
        description: 'Leave for male employees after childbirth',
        isActive: true
    },
    {
        id: 'LT005',
        name: 'Bereavement Leave',
        description: 'Leave due to death of immediate family member',
        isActive: true
    },
    {
        id: 'LT006',
        name: 'Study Leave',
        description: 'Leave for professional development and education',
        isActive: false
    }
];

export const leaveRequests = [
    {
        id: 'LR001',
        employeeId: 'EMP001',
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
        id: 'LR002',
        employeeId: 'EMP002',
        employeeName: 'Jennifer White',
        leaveType: 'Sick Leave',
        startDate: '2025-05-18',
        endDate: '2025-05-19',
        duration: 2,
        status: 'approved',
        appliedDate: '2025-05-16',
        reason: 'Medical appointment'
    },
    {
        id: 'LR003',
        employeeId: 'EMP003',
        employeeName: 'William Clark',
        leaveType: 'Annual Leave',
        startDate: '2025-06-01',
        endDate: '2025-06-07',
        duration: 7,
        status: 'rejected',
        appliedDate: '2025-05-14',
        reason: 'Personal matters'
    },
    {
        id: 'LR004',
        employeeId: 'EMP004',
        employeeName: 'Mary Martinez',
        leaveType: 'Bereavement Leave',
        startDate: '2025-05-19',
        endDate: '2025-05-23',
        duration: 5,
        status: 'approved',
        appliedDate: '2025-05-17',
        reason: 'Family emergency'
    },
    {
        id: 'LR005',
        employeeId: 'EMP001',
        employeeName: 'Robert Taylor',
        leaveType: 'Sick Leave',
        startDate: '2025-05-21',
        endDate: '2025-05-21',
        duration: 1,
        status: 'pending',
        appliedDate: '2025-05-20',
        reason: 'Not feeling well'
    }
];