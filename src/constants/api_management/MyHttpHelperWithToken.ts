import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/";

const AxiosWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let retryCount = 0;

AxiosWithToken.interceptors.request.use(
  async (config) => {
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
    if (error.response && error.response.status === 401) {
      window.location.href = "/auth/login";

      return Promise.reject(error);
    }

    // Handle other error cases here if needed

    return Promise.reject(error);
  }
);

export default AxiosWithToken;
