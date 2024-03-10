import store from "./StoreConfig";
import { logoutAction } from "./StoreActionConfig";
import AHNIHttp from "./HttpConfig";

AHNIHttp.interceptors.request.use((config) => {
  const { access_token } = store.getState().global.authUser || {};

  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  return config;
});

AHNIHttp.interceptors.response.use(undefined, (error) => {
  const authUser = store.getState().global.authUser;
  if (error?.response?.status === 401 && authUser) {
    store.dispatch(logoutAction());
  }
  return Promise.reject(error);
});
