import axios from "axios";

// Normalize baseURL to always end with a single slash
const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/";
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const AxiosWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    // Don't set default Content-Type - let each request set its own
    // FormData requests need multipart/form-data, JSON requests need application/json
  },
  timeout: 60000, // 60 seconds timeout
});

let retryCount = 0;

AxiosWithToken.interceptors.request.use(
  async (config) => {
    console.log('🔥 INTERCEPTOR START:', config.method, config.url);

    if (config.data instanceof FormData) {
      console.log('🚨 FORMDATA DETECTED!');
    }

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

    // Enhanced token debugging for FormData requests
    if (config.data instanceof FormData) {
      console.log('🔍 TOKEN DEBUG for FormData:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
        willAddAuthHeader: !!token
      });
    }

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

      // Confirm auth header was set for FormData
      if (config.data instanceof FormData) {
        console.log('✅ Authorization header set for FormData request');
      }
    } else {
      console.warn('⚠️ No token found - request will be unauthenticated');
    }

    // ✅ FIX: Set appropriate Content-Type based on request data
    if (config.data instanceof FormData) {
      console.log('🚨 INTERCEPTOR: PROCESSING FORMDATA REQUEST');

      // For FormData, let browser set multipart/form-data with boundary
      delete config.headers['Content-Type'];

      // === COMPREHENSIVE FORMDATA REQUEST ANALYSIS ===
      console.log('📤 COMPLETE REQUEST ANALYSIS:', {
        timestamp: new Date().toISOString(),
        url: `${config.baseURL || ''}${config.url || ''}`,
        method: config.method?.toUpperCase(),
        timeout: config.timeout,
        hasAuth: !!config.headers.Authorization,
        authPreview: config.headers.Authorization ?
          `${String(config.headers.Authorization).substring(0, 20)}...` : 'NO AUTH'
      });

      // Detailed FormData analysis
      console.log('📋 FORMDATA ENTRIES BEING SENT:');
      let totalFormDataSize = 0;
      Array.from(config.data.entries()).forEach(([key, value]) => {
        if (value instanceof File) {
          totalFormDataSize += value.size;
          console.log(`  📁 ${key}:`, {
            fileName: value.name,
            fileSize: value.size,
            fileType: value.type,
            lastModified: new Date(value.lastModified).toISOString(),
            isValidFile: value.size > 0 && value.name.length > 0
          });
        } else {
          totalFormDataSize += String(value).length;
          console.log(`  📝 ${key}:`, {
            value: value,
            type: typeof value,
            length: String(value).length,
            isValid: value !== undefined && value !== null
          });
        }
      });

      console.log('📊 FORMDATA SUMMARY:', {
        totalEntries: Array.from(config.data.entries()).length,
        estimatedSize: totalFormDataSize,
        hasFile: Array.from(config.data.entries()).some(([_, value]) => value instanceof File)
      });

      // Headers analysis
      console.log('📤 REQUEST HEADERS:', {
        authorization: config.headers.Authorization ? 'Present' : 'Missing',
        contentType: config.headers['Content-Type'] || 'Not set (correct for FormData)',
        userAgent: config.headers['User-Agent'] || 'Default',
        allHeaders: Object.keys(config.headers).map(key =>
          key.toLowerCase() === 'authorization' ?
            `${key}: Bearer [REDACTED]` :
            `${key}: ${config.headers[key]}`
        )
      });

    } else if (config.data && !config.headers['Content-Type']) {
      // For JSON data, set application/json if not already set
      config.headers['Content-Type'] = 'application/json';
    }

    retryCount = 0;

    if (config.data instanceof FormData) {
      console.log('🔥 INTERCEPTOR END - FormData request ready:', {
        hasAuth: !!config.headers.Authorization,
        hasContentType: !!config.headers['Content-Type'],
        url: config.url
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

AxiosWithToken.interceptors.response.use(
  (response) => {
    // Enhanced logging for FormData responses (successful uploads)
    if (response.config?.data instanceof FormData) {
      console.log('✅ FORMDATA UPLOAD SUCCESS:', {
        status: response.status,
        url: response.config.url,
        responseData: response.data
      });
    }
    return response;
  },
  async (error) => {
    // Enhanced error logging with special handling for FormData errors
    const isFormDataError = error.config?.data instanceof FormData;

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

    // Special debugging for FormData upload errors
    if (isFormDataError) {
      console.error('❌ FORMDATA UPLOAD ERROR - Detailed Analysis:', {
        requestUrl: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
        requestMethod: error.config?.method?.toUpperCase(),
        requestHeaders: { ...error.config?.headers },
        responseStatus: error.response?.status,
        responseHeaders: error.response?.headers,
        responseBody: error.response?.data,
        requestBodyType: error.config?.data?.constructor?.name,
        requestBodySize: error.config?.data instanceof FormData ?
          'FormData (size not directly measurable)' :
          JSON.stringify(error.config?.data || {}).length,
        errorType: error.code || 'HTTP_ERROR'
      });
    }

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
