import axios from "axios";

// Normalize baseURL to always end with a single slash
const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://127.0.0.1:8000/api/v1/";
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const ConsultantAxiosWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    // Don't set default Content-Type - let each request set its own
  },
  timeout: 60000, // 60 seconds timeout
});

let retryCount = 0;

ConsultantAxiosWithToken.interceptors.request.use(
  async (config) => {
    // Remove leading slash from config.url to prevent double slashes
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }

    // Get consultant-specific token
    const consultantToken = localStorage.getItem("consultant_access_token");

    console.log('👨‍💼 Consultant API Request:', {
      url: config.url,
      method: config.method,
      hasConsultantToken: !!consultantToken,
      tokenLength: consultantToken?.length || 0,
      tokenPreview: consultantToken ? `${consultantToken.substring(0, 20)}...` : 'NO CONSULTANT TOKEN'
    });

    if (!consultantToken && retryCount < 3) {
      console.log(`Consultant token retry attempt ${retryCount + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      retryCount++;
      return ConsultantAxiosWithToken.request(config);
    }

    if (retryCount === 3) {
      console.log("Max consultant token retries reached, proceeding without token");
      retryCount = 0;
      return config;
    }

    if (consultantToken) {
      config.headers.Authorization = `Bearer ${consultantToken}`;
      console.log('✅ Consultant Authorization header set');
    } else {
      console.warn('⚠️ No consultant token found - request will be unauthenticated');
    }

    // Set appropriate Content-Type based on request data
    if (config.data instanceof FormData) {
      // For FormData, let browser set multipart/form-data with boundary
      delete config.headers['Content-Type'];
    } else if (config.data && !config.headers['Content-Type']) {
      // For JSON data, set application/json if not already set
      config.headers['Content-Type'] = 'application/json';
    }

    retryCount = 0;
    return config;
  },
  (error) => Promise.reject(error)
);

ConsultantAxiosWithToken.interceptors.response.use(
  (response) => {
    console.log('✅ Consultant API Success:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    console.error('❌ Consultant API Error:', {
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

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'Request timeout - The server is taking too long to respond. Please try again.';
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error - Unable to connect to the server. Please check your connection and try again.';
    }

    // Handle authentication and permission errors
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn(`🔒 Consultant access error (${error.response.status}):`, error.response.data);

      const originalRequest = error.config;
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      console.log(`🔍 Consultant ${error.response.status} Error - Current path:`, currentPath);

      // Handle 403 permission errors differently than 401 auth errors
      if (error.response.status === 403) {
        console.warn('🚫 Permission denied - consultant may need additional authorization or account approval');
        // Don't redirect for permission errors, let the component handle it
        return Promise.reject(error);
      }

      // For consultant portal routes, handle consultant-specific auth failure
      if (currentPath.startsWith('/consultant-portal') && !originalRequest._retry) {
        originalRequest._retry = true;

        const consultantRefreshToken = localStorage.getItem('consultant_refresh_token');

        if (consultantRefreshToken) {
          try {
            console.log('🔄 Attempting consultant token refresh...');

            // Call consultant-specific refresh endpoint
            const refreshResponse = await axios.post(`${baseURL}contract-grants/consultant-portal/auth/token/refresh/`, {
              refresh: consultantRefreshToken
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            console.log('✅ Consultant token refresh successful');

            // Update stored consultant tokens
            const newAccessToken = refreshResponse.data.access_token || refreshResponse.data.access;
            const newRefreshToken = refreshResponse.data.refresh_token || refreshResponse.data.refresh;

            localStorage.setItem('consultant_access_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('consultant_refresh_token', newRefreshToken);
            }

            // Update authorization header for the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return ConsultantAxiosWithToken(originalRequest);

          } catch (refreshError) {
            console.warn('❌ Consultant token refresh failed, redirecting to consultant login');
            console.error('Consultant refresh error:', refreshError);

            // Clear consultant tokens
            localStorage.removeItem('consultant_access_token');
            localStorage.removeItem('consultant_refresh_token');
            localStorage.removeItem('consultant_user');

            // Redirect to consultant login
            window.location.href = "/consultant-portal/login";
            return Promise.reject(refreshError);
          }
        } else {
          console.warn('❌ No consultant refresh token available, redirecting to consultant login');

          // Clear consultant tokens
          localStorage.removeItem('consultant_access_token');
          localStorage.removeItem('consultant_user');

          // Redirect to consultant login
          window.location.href = "/consultant-portal/login";
        }
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default ConsultantAxiosWithToken;
