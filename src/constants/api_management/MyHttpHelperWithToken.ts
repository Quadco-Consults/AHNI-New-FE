import axios from "axios";

// Normalize baseURL to always end with a single slash
const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/";
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const AxiosWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 seconds timeout
});

let retryCount = 0;

AxiosWithToken.interceptors.request.use(
  async (config) => {
    // Remove leading slash from config.url to prevent double slashes
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }

    // Debug: Log the full request URL (only in development)
    if (process.env.NODE_ENV === 'development') {
      const url = `${config.baseURL || ''}${config.url || ''}`;
      // Skip logging for frequent notification polls to reduce console noise
      if (!url.includes('/notifications')) {
        console.log('API Request:', config.method?.toUpperCase(), url);
      }
    }
    if (config.data && config.url?.includes('create-committee')) {
      console.log('Committee Request Body:', JSON.stringify(config.data, null, 2));
    }

    // Debug: Log purchase request approval payloads
    if (config.data && config.url?.includes('purchase-request') && config.method?.toLowerCase() === 'patch') {
      console.log('🔍 Purchase Request PATCH Body:', JSON.stringify(config.data, null, 2));
      console.log('🔍 Purchase Request PATCH Data Type:', typeof config.data);
      console.log('🔍 Purchase Request PATCH Data (raw):', config.data);
      console.log('🔍 Has action field?:', 'action' in (config.data || {}));
      console.log('🔍 Action value from interceptor:', config.data?.action);
      console.log('🔍 Request will be sent with Content-Type:', config.headers['Content-Type']);
    }

    const token = localStorage.getItem("token");

    if (!token && retryCount < 3) {
      console.log(`Token retry attempt ${retryCount + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      retryCount++;
      return AxiosWithToken.request(config);
    }

    if (retryCount === 3) {
      console.log("Max retries reached, proceeding without token");
      retryCount = 0;
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ FIX: Remove Content-Type header for FormData requests
    // Let browser set the correct multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    retryCount = 0;
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosWithToken.interceptors.response.use(
  (response) => {
    // Handle successful responses here
    return response;
  },
  async (error) => {
    // Enhanced error logging
    console.error('AxiosWithToken Response Error:', {
      code: error.code,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // Handle timeout errors with user-friendly message
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'Request timeout - The server is taking too long to respond. Please try again.';
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error - Unable to connect to the server. Please check your connection and try again.';
    }

    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access detected');

      const originalRequest = error.config;

      // Check if we're on a public route - don't redirect these to login
      const publicRoutes = ['/eoi', '/rfq', '/rfp', '/vendor-portal/login'];
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));

      console.log('🔍 401 Error - Current path:', currentPath);
      console.log('🔍 401 Error - Is public route:', isPublicRoute);
      console.log('🔍 401 Error - Public routes:', publicRoutes);

      // Only attempt token refresh for protected routes and if not already retried
      if (!isPublicRoute && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            console.log('🔄 Attempting token refresh...');

            // Call the new refresh endpoint
            const refreshResponse = await axios.post(`${baseURL}auth/token/refresh/`, {
              refresh: refreshToken
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            console.log('✅ Token refresh successful');

            // Update stored tokens
            const newAccessToken = refreshResponse.data.data.access;
            const newRefreshToken = refreshResponse.data.data.refresh;

            localStorage.setItem('token', newAccessToken);
            localStorage.setItem('refresh_token', newRefreshToken);

            // Update authorization header for the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return AxiosWithToken(originalRequest);

          } catch (refreshError) {
            // Refresh failed - redirect to login
            console.warn('❌ Token refresh failed, redirecting to login');
            console.error('Refresh error:', refreshError);

            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');

            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token - redirect to login
          console.warn('❌ No refresh token available, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = "/auth/login";
        }
      } else if (isPublicRoute) {
        console.warn('401 on public route - not redirecting to login');
      }

      return Promise.reject(error);
    }

    // Handle other error cases here if needed
    return Promise.reject(error);
  }
);

export default AxiosWithToken;
