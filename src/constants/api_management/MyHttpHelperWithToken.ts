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
      console.warn('Unauthorized access - redirecting to login');
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    // Handle other error cases here if needed
    return Promise.reject(error);
  }
);

export default AxiosWithToken;
