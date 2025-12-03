/**
 * Admin Login Debugging Tool
 *
 * Run this in browser console to debug admin login redirection issues
 */

function debugAdminLogin() {
    console.log('🔍 ADMIN LOGIN DEBUG STARTED');
    console.log('===============================');

    // Check authentication state
    const authData = localStorage.getItem('auth') || localStorage.getItem('user') || localStorage.getItem('token');

    console.log('📋 AUTHENTICATION STATE:');
    console.log('  localStorage auth data exists:', !!authData);

    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            console.log('  Parsed auth data:', {
                hasUser: !!parsed.user,
                hasToken: !!(parsed.access_token || parsed.token),
                isAuthenticated: parsed.isAuthenticated,
                userEmail: parsed.user?.email
            });
        } catch (e) {
            console.log('  ❌ Failed to parse auth data:', e.message);
        }
    }

    // Check Redux store if available
    if (window.store) {
        const state = window.store.getState();
        const authState = state.auth;

        console.log('\n🏪 REDUX AUTH STATE:');
        console.log('  isAuthenticated:', authState?.isAuthenticated);
        console.log('  isLoading:', authState?.loading);
        console.log('  user exists:', !!authState?.user);
        console.log('  token exists:', !!(authState?.access_token || authState?.token));

        if (authState?.user) {
            console.log('  User details:', {
                email: authState.user.email,
                is_superuser: authState.user.is_superuser,
                is_staff: authState.user.is_staff,
                is_active: authState.user.is_active
            });
        }
    }

    // Check current URL and routing
    console.log('\n🌐 ROUTING INFO:');
    console.log('  Current URL:', window.location.href);
    console.log('  Pathname:', window.location.pathname);
    console.log('  Is guest page:', window.location.pathname.includes('guest'));

    // Check for any error messages in console
    console.log('\n🚨 CHECK CONSOLE FOR:');
    console.log('  - Network errors (Failed to fetch)');
    console.log('  - Authentication errors (401, 403)');
    console.log('  - Permission errors');
    console.log('  - Redux action errors');

    // Check API connectivity
    console.log('\n🔗 NEXT STEPS TO TRY:');
    console.log('1. Clear localStorage and try login again');
    console.log('2. Check Network tab for failed API calls');
    console.log('3. Verify backend is running and accessible');
    console.log('4. Check if admin user exists and has correct permissions');

    return {
        hasAuthData: !!authData,
        currentPath: window.location.pathname,
        isGuestPage: window.location.pathname.includes('guest')
    };
}

// Auto-run the debug
console.log('🚀 Running Admin Login Debug...');
const result = debugAdminLogin();

// Provide quick fix commands
console.log('\n🛠️ QUICK FIXES TO TRY:');
console.log('1. Clear storage: localStorage.clear()');
console.log('2. Refresh page: window.location.reload()');
console.log('3. Go to login: window.location.href = "/auth/login"');

// Make function available globally
window.debugAdminLogin = debugAdminLogin;