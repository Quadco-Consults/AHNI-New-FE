import axios from "axios";

// Normalize baseURL to always end with a single slash
const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://127.0.0.1:8000/api/v1/";
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const Axios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Add request interceptor for logging and URL normalization
Axios.interceptors.request.use(
  (config) => {
    // Debug logging
    console.log('🔍 Request Interceptor Debug:', {
      originalUrl: config.url,
      baseURL: config.baseURL,
      startsWithSlash: config.url?.startsWith('/'),
    });

    // Remove leading slash from config.url to prevent double slashes
    if (config.url && config.url.startsWith('/')) {
      console.log('⚠️ Stripping leading slash from:', config.url);
      config.url = config.url.substring(1);
      console.log('✅ Result after stripping:', config.url);
    }

    const url = `${config.baseURL || ''}${config.url || ''}`;
    console.log('🌐 Final API Request:', config.method?.toUpperCase(), url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', {
      code: error.code,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default Axios;
