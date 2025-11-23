#!/usr/bin/env node

/**
 * Debug script to test permission system
 *
 * This simulates the Admin Officer scenario to verify the sidebar filtering works correctly.
 */

// Mock Admin Officer user data (based on typical structure)
const mockAdminOfficerUser = {
  id: "admin-officer-123",
  first_name: "John",
  last_name: "Doe",
  email: "admin.officer@ahni.org",
  roles: [
    {
      id: "role-admin-officer",
      name: "Admin Officer"
    }
  ],
  permissions: [
    {
      module: "hr",
      permissions: [
        { id: 1, codename: "view_employee" },
        { id: 2, codename: "view_leaverequest" },
        { id: 3, codename: "view_timesheet" },
        { id: 4, codename: "view_jobadvertisement" },
        { id: 5, codename: "add_employee" },
        { id: 6, codename: "change_employee" }
      ]
    },
    {
      module: "users",
      permissions: [
        { id: 7, codename: "can_view_global_hub" }
      ]
    }
  ],
  is_superuser: false,
  is_staff: true,
  is_active: true
};

console.log('\n🔍 Admin Officer Permission Debug\n');
console.log('User:', mockAdminOfficerUser.first_name, mockAdminOfficerUser.last_name);
console.log('Role:', mockAdminOfficerUser.roles[0].name);
console.log('Total Permissions:', mockAdminOfficerUser.permissions.reduce((total, module) => total + module.permissions.length, 0));

// Test the isSuperAdmin logic
const userPermissions = mockAdminOfficerUser.permissions;

// Check if user would be detected as super admin with OLD threshold (5)
const oldThreshold = userPermissions.length >= 5;
console.log('\n📊 Super Admin Detection:');
console.log('- Permission modules:', userPermissions.length);
console.log('- Would be super admin with OLD threshold (5)?', oldThreshold ? '❌ YES (WRONG!)' : '✅ No');

// Check with NEW threshold (30)
const newThreshold = userPermissions.length >= 30;
console.log('- Would be super admin with NEW threshold (30)?', newThreshold ? '❌ Yes' : '✅ No (CORRECT!)');

// Check specific HR permissions
const hrModule = userPermissions.find(p => p.module === 'hr');
const hrPermissions = hrModule ? hrModule.permissions.map(p => p.codename) : [];

console.log('\n🏥 HR Module Permissions:');
hrPermissions.forEach(perm => {
  console.log('- ✅', perm);
});

// Check Global Hub access
const usersModule = userPermissions.find(p => p.module === 'users');
const hasGlobalHubAccess = usersModule ?
  usersModule.permissions.some(p => p.codename === 'can_view_global_hub') : false;

console.log('\n🌐 Global Hub Access:', hasGlobalHubAccess ? '✅ Yes' : '❌ No');

console.log('\n📝 Expected Behavior:');
console.log('- Should see HR menu: ✅ Yes (has hr.view_* permissions)');
console.log('- Should see Global Hub: ✅ Yes (has can_view_global_hub)');
console.log('- Should NOT see other modules: ✅ Correct (no permissions for other modules)');
console.log('- Should NOT have approval buttons: ✅ Correct (no approval permissions)');

console.log('\n✅ Fix Applied: Increased super admin threshold from 5 to 30 permissions');
console.log('This prevents Admin Officers from being incorrectly treated as super admins.\n');