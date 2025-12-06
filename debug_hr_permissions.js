/**
 * HR Permission Debugging Tool
 *
 * Run this in your browser console while logged in as HR Manager/Officer
 * to check why the "Employee compensation & benefits" menu isn't showing.
 */

function debugHRPermissions() {
  console.log('🔍 HR PERMISSION DEBUGGING STARTED');
  console.log('=====================================');

  // Try to get user data from various possible locations
  let user = null;
  let userPermissions = [];
  let userRoles = [];

  // Method 1: Redux store (most common)
  if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.store) {
    const state = window.store.getState();
    user = state.auth?.user || state.user;
    userPermissions = user?.permissions || [];
    userRoles = user?.roles || [];
    console.log('📦 Redux Store Data Found');
  }

  // Method 2: Check localStorage
  if (!user) {
    const authData = localStorage.getItem('auth') || localStorage.getItem('user');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        user = parsed.user || parsed;
        userPermissions = user?.permissions || [];
        userRoles = user?.roles || [];
        console.log('💾 localStorage Data Found');
      } catch (e) {
        console.log('❌ Failed to parse localStorage auth data');
      }
    }
  }

  // Method 3: Global variables (fallback)
  if (!user && window.user) {
    user = window.user;
    userPermissions = user?.permissions || [];
    userRoles = user?.roles || [];
    console.log('🌐 Global user variable found');
  }

  if (!user) {
    console.log('❌ NO USER DATA FOUND! Please login first.');
    return;
  }

  console.log('👤 USER INFORMATION:');
  console.log('  Email:', user.email);
  console.log('  Name:', user.first_name, user.last_name);
  console.log('  Department:', user.employee?.department?.name || user.department?.name || 'None');
  console.log('  Position:', user.position?.title || user.position?.name || 'None');
  console.log('  Is Staff:', user.is_staff);
  console.log('  Is Superuser:', user.is_superuser);

  console.log('\n🔐 PERMISSIONS ANALYSIS:');
  console.log('  Total Permission Modules:', userPermissions.length);

  // Find HR module permissions
  const hrModule = userPermissions.find(p => p.module === 'hr');
  if (!hrModule) {
    console.log('❌ NO HR MODULE PERMISSIONS FOUND!');
    console.log('📋 Available modules:', userPermissions.map(p => p.module));
    return;
  }

  console.log('✅ HR Module Found with', hrModule.permissions?.length || 0, 'permissions');

  // Check specific compensation permissions
  const compensationPerms = hrModule.permissions?.filter(p =>
    p.codename === 'view_compensation' ||
    p.codename === 'view_paygroup' ||
    p.codename === 'view_payrollbatch' ||
    p.codename === 'view_compensationspread'
  ) || [];

  console.log('\n💰 COMPENSATION PERMISSIONS:');
  if (compensationPerms.length === 0) {
    console.log('❌ NO COMPENSATION PERMISSIONS FOUND!');
    console.log('📋 Available HR permissions:');
    hrModule.permissions?.forEach(p => console.log('  -', p.codename));
  } else {
    console.log('✅ Found compensation permissions:');
    compensationPerms.forEach(p => console.log('  ✓', p.codename, '-', p.name));
  }

  // Test the permission checking logic
  console.log('\n🧪 PERMISSION LOGIC TEST:');

  // Simulate the exact permission requirement from sidebarItems.tsx
  const compensationRequirement = {
    module: "hr",
    codenames: ["view_compensation", "view_paygroup"]
  };

  console.log('Testing requirement:', compensationRequirement);

  // Check if user has the required permissions (OR logic)
  const hasViewCompensation = hrModule.permissions?.some(p => p.codename === 'view_compensation');
  const hasViewPaygroup = hrModule.permissions?.some(p => p.codename === 'view_paygroup');

  console.log('  Has view_compensation:', hasViewCompensation);
  console.log('  Has view_paygroup:', hasViewPaygroup);
  console.log('  Should show menu (OR logic):', hasViewCompensation || hasViewPaygroup);

  // Test enhanced permission checking
  console.log('\n🔧 ENHANCED PERMISSION CHECK:');

  // Check department-based access
  const isHRDepartment = (user.employee?.department?.name || user.department?.name) === 'HR';
  const emailContainsHR = user.email?.toLowerCase().includes('hr');
  const positionContainsHR = (user.position?.title || user.position?.name || '').toLowerCase().includes('hr');

  console.log('  Is HR Department:', isHRDepartment);
  console.log('  Email contains HR:', emailContainsHR);
  console.log('  Position contains HR:', positionContainsHR);
  console.log('  Should have HR access:', isHRDepartment || emailContainsHR || positionContainsHR);

  // Check roles
  console.log('\n👥 ROLE INFORMATION:');
  console.log('  Total roles:', userRoles.length);
  userRoles.forEach(role => {
    const roleName = typeof role === 'string' ? role : role.name || role.id || 'Unknown';
    console.log('  -', roleName);
  });

  // Final recommendation
  console.log('\n💡 DIAGNOSIS:');
  if (!hasViewCompensation && !hasViewPaygroup) {
    console.log('❌ PROBLEM: Missing compensation permissions');
    console.log('🔧 SOLUTION: Assign view_compensation and/or view_paygroup permissions to this user');
    console.log('📋 Backend action needed: Add these permissions to the user\'s HR role');
  } else {
    console.log('✅ User has correct permissions - check frontend filtering logic');
    console.log('🔧 SOLUTION: The issue might be in the sidebar permission filtering');
  }

  console.log('\n📞 NEXT STEPS:');
  console.log('1. If permissions missing: Update backend role assignments');
  console.log('2. If permissions present: Check sidebar filtering logic');
  console.log('3. Check browser console for permission filter logs');

  return {
    user,
    userPermissions,
    hrModule,
    compensationPerms,
    hasViewCompensation,
    hasViewPaygroup,
    shouldShowMenu: hasViewCompensation || hasViewPaygroup
  };
}

// Auto-run the debug function
console.log('🚀 Running HR Permission Debug...');
const result = debugHRPermissions();

// Make it available globally for manual testing
window.debugHRPermissions = debugHRPermissions;