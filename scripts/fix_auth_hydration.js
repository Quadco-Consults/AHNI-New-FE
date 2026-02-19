#!/usr/bin/env node

/**
 * Quick Authentication Hydration Fix
 *
 * This script will help diagnose and fix the authentication issues
 * Run this in your browser console on the affected page
 */

console.log('🔧 AHNI Authentication Hydration Fix');
console.log('=====================================');

// Check current auth state
const checkAuthState = () => {
  console.log('🔍 Current Authentication Status:');

  // Check localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const persistData = localStorage.getItem('persist:ahni');

  console.log('📋 Storage Status:');
  console.log('  Token:', !!token ? '✅ Present' : '❌ Missing');
  console.log('  User Data:', !!user ? '✅ Present' : '❌ Missing');
  console.log('  Redux Persist:', !!persistData ? '✅ Present' : '❌ Missing');

  if (token) {
    console.log('  Token Preview:', token.substring(0, 20) + '...');

    // Try to decode JWT token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      const isExpired = payload.exp < now;

      console.log('  Token Expiry:', isExpired ? '❌ EXPIRED' : '✅ Valid');
      if (isExpired) {
        console.log('  Expired at:', new Date(payload.exp * 1000).toLocaleString());
      }
    } catch (e) {
      console.log('  Token Format:', '❌ Invalid JWT');
    }
  }

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('  User ID:', userData.id || 'N/A');
      console.log('  Email:', userData.email || 'N/A');
    } catch (e) {
      console.log('  User Data:', '❌ Invalid JSON');
    }
  }
};

// Fix authentication state
const fixAuthState = () => {
  console.log('\n🛠️  Attempting Authentication Fix:');

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token) {
    console.log('❌ No token found - Please log in again');
    console.log('📍 Redirect to: /auth/login');
    return false;
  }

  // Try to verify token is valid
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    if (payload.exp < now) {
      console.log('❌ Token expired - Please log in again');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('📍 Redirect to: /auth/login');
      return false;
    }

    console.log('✅ Token is valid');

    // Force Redux state update
    if (window.__REDUX_STORE__) {
      console.log('🔄 Updating Redux store...');
      window.__REDUX_STORE__.dispatch({
        type: 'auth/setAuth',
        payload: {
          access_token: token,
          user: user ? JSON.parse(user) : null,
          isAuthenticated: true,
          loading: false
        }
      });
      console.log('✅ Redux state updated');
    }

    // Force page reload to trigger hydration
    console.log('🔄 Reloading page to complete hydration...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);

    return true;

  } catch (e) {
    console.log('❌ Token validation failed:', e.message);
    return false;
  }
};

// Test API connectivity
const testAPI = async () => {
  console.log('\n🧪 Testing API Connectivity:');

  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No token for API test');
    return;
  }

  try {
    const response = await fetch('https://127.0.0.1:8000/api/v1/users/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection: Working');
      console.log('📋 Profile Data:', data.first_name, data.last_name);
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
      if (response.status === 401) {
        console.log('🔄 Token may be invalid - clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
};

// Main execution
const runFix = async () => {
  checkAuthState();

  const fixed = fixAuthState();
  if (fixed) {
    await testAPI();
  }

  console.log('\n📋 Summary:');
  console.log('1. If token is valid: Page will reload automatically');
  console.log('2. If token is invalid: Please log in at /auth/login');
  console.log('3. If API errors persist: Check backend server status');
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.ahniAuthFix = {
    checkAuthState,
    fixAuthState,
    testAPI,
    runFix
  };

  console.log('🎯 Available commands:');
  console.log('  ahniAuthFix.runFix() - Run complete fix');
  console.log('  ahniAuthFix.checkAuthState() - Check current status');
  console.log('  ahniAuthFix.testAPI() - Test API connectivity');
}

// Auto-run if called directly
if (typeof module === 'undefined') {
  runFix();
}