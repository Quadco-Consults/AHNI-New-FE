import axios from "axios";

// Normalize baseURL to always end with a single slash
const rawBaseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/";
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
    // Remove leading slash from config.url to prevent double slashes
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }

    const url = `${config.baseURL || ''}${config.url || ''}`;
    console.log('API Request:', config.method?.toUpperCase(), url);
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
