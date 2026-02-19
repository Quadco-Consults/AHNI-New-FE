import axios from "axios";

// Normalize baseURL to always end with a single slash
const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://127.0.0.1:8000/api/v1/";
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const VendorAxiosWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    // Don't set default Content-Type - let each request set its own
  },
  timeout: 60000, // 60 seconds timeout
});

let retryCount = 0;

VendorAxiosWithToken.interceptors.request.use(
  async (config) => {
    // Remove leading slash from config.url to prevent double slashes
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }

    // Get vendor-specific token
    const vendorToken = localStorage.getItem("vendor_access_token");

    console.log('🏪 Vendor API Request:', {
      url: config.url,
      method: config.method,
      hasVendorToken: !!vendorToken,
      tokenLength: vendorToken?.length || 0,
      tokenPreview: vendorToken ? `${vendorToken.substring(0, 20)}...` : 'NO VENDOR TOKEN'
    });

    if (!vendorToken && retryCount < 3) {
      console.log(`Vendor token retry attempt ${retryCount + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      retryCount++;
      return VendorAxiosWithToken.request(config);
    }

    if (retryCount === 3) {
      console.log("Max vendor token retries reached, proceeding without token");
      retryCount = 0;
      return config;
    }

    if (vendorToken) {
      config.headers.Authorization = `Bearer ${vendorToken}`;
      console.log('✅ Vendor Authorization header set');
    } else {
      console.warn('⚠️ No vendor token found - request will be unauthenticated');
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

VendorAxiosWithToken.interceptors.response.use(
  (response) => {
    console.log('✅ Vendor API Success:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    console.error('❌ Vendor API Error:', {
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
      console.warn(`🔒 Vendor access error (${error.response.status}):`, error.response.data);

      const originalRequest = error.config;
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      console.log(`🔍 Vendor ${error.response.status} Error - Current path:`, currentPath);

      // Handle 403 permission errors differently than 401 auth errors
      if (error.response.status === 403) {
        console.warn('🚫 Permission denied - vendor may need additional authorization or account approval');
        // Don't redirect for permission errors, let the component handle it
        return Promise.reject(error);
      }

      // For vendor portal routes, handle vendor-specific auth failure
      if (currentPath.startsWith('/vendor-portal') && !originalRequest._retry) {
        originalRequest._retry = true;

        const vendorRefreshToken = localStorage.getItem('vendor_refresh_token');

        if (vendorRefreshToken) {
          try {
            console.log('🔄 Attempting vendor token refresh...');

            // Call vendor-specific refresh endpoint
            const refreshResponse = await axios.post(`${baseURL}procurements/vendor/auth/refresh/`, {
              refresh: vendorRefreshToken
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            console.log('✅ Vendor token refresh successful');

            // Update stored vendor tokens
            const newAccessToken = refreshResponse.data.data?.access_token || refreshResponse.data.access;
            const newRefreshToken = refreshResponse.data.data?.refresh_token || refreshResponse.data.refresh;

            localStorage.setItem('vendor_access_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('vendor_refresh_token', newRefreshToken);
            }

            // Update authorization header for the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return VendorAxiosWithToken(originalRequest);

          } catch (refreshError) {
            console.warn('❌ Vendor token refresh failed, redirecting to vendor login');
            console.error('Vendor refresh error:', refreshError);

            // Clear vendor tokens
            localStorage.removeItem('vendor_access_token');
            localStorage.removeItem('vendor_refresh_token');
            localStorage.removeItem('vendor_user');

            // Redirect to vendor login
            window.location.href = "/vendor-portal/login";
            return Promise.reject(refreshError);
          }
        } else {
          console.warn('❌ No vendor refresh token available, redirecting to vendor login');

          // Clear vendor tokens
          localStorage.removeItem('vendor_access_token');
          localStorage.removeItem('vendor_user');

          // Redirect to vendor login
          window.location.href = "/vendor-portal/login";
        }
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default VendorAxiosWithToken;