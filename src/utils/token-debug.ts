/**
 * Token debugging utility for AHNI ERP
 * Use this to debug authentication and token refresh issues
 */

export const debugTokenStatus = () => {
  console.log('🔍 === TOKEN DEBUG STATUS ===');

  // Check token existence
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh_token');
  const user = localStorage.getItem('user');

  console.log('📊 Token Status:');
  console.log('  - Access Token:', token ? '✅ Present' : '❌ Missing');
  console.log('  - Refresh Token:', refreshToken ? '✅ Present' : '❌ Missing');
  console.log('  - User Data:', user ? '✅ Present' : '❌ Missing');

  // Try to decode JWT tokens
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now >= exp;

      console.log('🔑 Access Token Details:');
      console.log('  - Expires at:', exp.toLocaleString());
      console.log('  - Current time:', now.toLocaleString());
      console.log('  - Status:', isExpired ? '🔴 EXPIRED' : '🟢 VALID');
      console.log('  - Time remaining:', isExpired ? 'Expired' : Math.round((exp.getTime() - now.getTime()) / 1000 / 60) + ' minutes');

      if (payload.user_id) {
        console.log('  - User ID:', payload.user_id);
      }
    } catch (e) {
      console.log('⚠️ Access token is not a valid JWT or corrupted');
    }
  }

  if (refreshToken) {
    try {
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      const exp = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now >= exp;

      console.log('🔄 Refresh Token Details:');
      console.log('  - Expires at:', exp.toLocaleString());
      console.log('  - Status:', isExpired ? '🔴 EXPIRED' : '🟢 VALID');
      console.log('  - Time remaining:', isExpired ? 'Expired' : Math.round((exp.getTime() - now.getTime()) / 1000 / 60 / 60) + ' hours');
    } catch (e) {
      console.log('⚠️ Refresh token is not a valid JWT or corrupted');
    }
  }

  // Check user data
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('👤 User Data:');
      console.log('  - Email:', userData.email || 'N/A');
      console.log('  - Name:', userData.name || userData.first_name + ' ' + userData.last_name || 'N/A');
      console.log('  - Role:', userData.role || 'N/A');
    } catch (e) {
      console.log('⚠️ User data is corrupted');
    }
  }

  console.log('🔍 === END TOKEN DEBUG ===');
};

/**
 * Test token refresh manually
 */
export const testTokenRefresh = async () => {
  console.log('🧪 Testing token refresh...');

  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('❌ No refresh token available for testing');
    return;
  }

  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/";
    const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;

    const response = await fetch(`${normalizedBaseURL}auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh: refreshToken
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Token refresh successful!');
      console.log('📊 Response:', data);

      // Update tokens
      if (data.data?.access) {
        localStorage.setItem('token', data.data.access);
        console.log('✅ Updated access token');
      }

      if (data.data?.refresh) {
        localStorage.setItem('refresh_token', data.data.refresh);
        console.log('✅ Updated refresh token');
      }

      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Token refresh failed:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    return false;
  }
};

/**
 * Clear all tokens and user data
 */
export const clearAllTokens = () => {
  console.log('🗑️ Clearing all tokens and user data...');
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  console.log('✅ All tokens cleared');
};