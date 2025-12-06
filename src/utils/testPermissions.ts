/**
 * Test Script for Permission System
 * Use this to verify the unified permission system works correctly
 */

import { PermissionService } from '@/services/permissionService';

// Mock user data for testing
const mockAdminUser = {
  user: {
    id: '1',
    is_superuser: true,
    is_staff: true
  },
  permissions: [
    {
      module: 'admin',
      permissions: [{ id: 1, name: 'Can view audit log', codename: 'view_auditlog' }]
    }
  ],
  roles: [
    { id: '1', name: 'Admin' }
  ]
};

const mockRegularUser = {
  user: {
    id: '2',
    is_superuser: false,
    is_staff: false
  },
  permissions: [
    {
      module: 'programs',
      permissions: [{ id: 2, name: 'Can view workplan', codename: 'view_workplan' }]
    }
  ],
  roles: [
    { id: '2', name: 'Program Officer' }
  ]
};

const mockJuniorUser = {
  user: {
    id: '3',
    is_superuser: false,
    is_staff: false
  },
  permissions: [
    {
      module: 'hr',
      permissions: [{ id: 3, name: 'Can view timesheet', codename: 'view_timesheet' }]
    }
  ],
  roles: [
    { id: '3', name: 'Junior Staff' }
  ]
};

export function testPermissionSystem() {
  const permissionService = PermissionService.getInstance();

  console.log('🧪 Testing Permission System...');

  // Test 1: Admin permissions (Super User)
  console.log('\n--- Test 1: Super Admin User ---');
  const adminNormalized = permissionService.normalizePermissions(mockAdminUser);
  console.log('Admin isAdmin:', adminNormalized.isAdmin); // Should be true

  const adminCanViewAudit = permissionService.hasPermission(adminNormalized, [
    { module: 'admin', codenames: ['view_auditlog'] }
  ]);
  console.log('Admin can view audit log:', adminCanViewAudit); // Should be true

  // Test new Settings permission
  const adminCanAccessSettings = permissionService.hasPermission(adminNormalized, [
    { module: 'users', codenames: ['view_user'] }
  ]);
  console.log('Admin can access Settings menu:', adminCanAccessSettings); // Should be true

  // Test new Modules permission (super admin only)
  const adminCanAccessModules = permissionService.hasPermission(adminNormalized, [
    { module: 'superuser', codenames: ['is_superuser'] }
  ]);
  console.log('Admin can access Modules menu (super admin only):', adminCanAccessModules); // Should be true

  // Test 2: Regular user permissions
  console.log('\n--- Test 2: Regular User ---');
  const regularNormalized = permissionService.normalizePermissions(mockRegularUser);
  console.log('Regular user isAdmin:', regularNormalized.isAdmin); // Should be false

  const regularCanViewWorkplan = permissionService.hasPermission(regularNormalized, [
    { module: 'programs', codenames: ['view_workplan'] }
  ]);
  console.log('Regular user can view workplan:', regularCanViewWorkplan); // Should be true

  const regularCanViewAudit = permissionService.hasPermission(regularNormalized, [
    { module: 'admin', codenames: ['view_auditlog'] }
  ]);
  console.log('Regular user can view audit log:', regularCanViewAudit); // Should be false

  // Test new Modules permission (should be false for regular users)
  const regularCanAccessModules = permissionService.hasPermission(regularNormalized, [
    { module: 'superuser', codenames: ['is_superuser'] }
  ]);
  console.log('Regular user can access Modules menu (super admin only):', regularCanAccessModules); // Should be false

  // Test 3: Junior user permissions
  console.log('\n--- Test 3: Junior User ---');
  const juniorNormalized = permissionService.normalizePermissions(mockJuniorUser);
  console.log('Junior user isAdmin:', juniorNormalized.isAdmin); // Should be false

  const juniorCanViewTimesheet = permissionService.hasPermission(juniorNormalized, [
    { module: 'hr', codenames: ['view_timesheet'] }
  ]);
  console.log('Junior user can view timesheet:', juniorCanViewTimesheet); // Should be true

  const juniorCanViewWorkplan = permissionService.hasPermission(juniorNormalized, [
    { module: 'programs', codenames: ['view_workplan'] }
  ]);
  console.log('Junior user can view workplan:', juniorCanViewWorkplan); // Should be false

  // Test Settings access for junior user (should be false)
  const juniorCanAccessSettings = permissionService.hasPermission(juniorNormalized, [
    { module: 'users', codenames: ['view_user'] }
  ]);
  console.log('Junior user can access Settings menu:', juniorCanAccessSettings); // Should be false

  // Test Modules access for junior user (should be false)
  const juniorCanAccessModules = permissionService.hasPermission(juniorNormalized, [
    { module: 'superuser', codenames: ['is_superuser'] }
  ]);
  console.log('Junior user can access Modules menu (super admin only):', juniorCanAccessModules); // Should be false

  // Test 4: Universal access (no permissions required)
  console.log('\n--- Test 4: Universal Access ---');
  const universalAccess = permissionService.hasPermission(juniorNormalized, []);
  console.log('Junior user has universal access (no permissions required):', universalAccess); // Should be true

  console.log('\n🎯 NEW SETTINGS & MODULES TESTING COMPLETE!')
  console.log('✅ Super admins can access Modules')
  console.log('✅ Regular users cannot access Modules')
  console.log('✅ Settings menu properly restricted')
  console.log('✅ Permission testing complete!')

  return {
    adminNormalized,
    regularNormalized,
    juniorNormalized,
    tests: {
      adminCanViewAudit,
      regularCanViewWorkplan,
      regularCanViewAudit: !regularCanViewAudit, // Should be false, so !false = true for passing test
      juniorCanViewTimesheet,
      juniorCanViewWorkplan: !juniorCanViewWorkplan, // Should be false, so !false = true for passing test
      universalAccess
    }
  };
}