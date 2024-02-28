import store from "./StoreConfig";
import { logoutAction } from "./StoreActionConfig";
import { CoreHttp } from "./HttpConfig";
import CryptoJS from "crypto-js";
import { EnvVarEnum } from "constants/Global";
// import { StoreQueryTagEnum } from "constants/StoreConstants";
// import { CoreApi } from "./StoreQueryConfig";
// import { playNotificationSound } from "features/system-notification/SystemNotificationUtils";

const key = CryptoJS.enc.Utf8.parse(EnvVarEnum.AES_ENCRYPTION_KEY);
const iv = CryptoJS.enc.Utf8.parse(EnvVarEnum.AES_ENCRYPTION_IV);

CoreHttp.interceptors.request.use((config) => {
  const { base64EncodedAuthenticationKey, twoFactorInfo } =
    store.getState().global.authUser || {};
  let data = {};

  if (base64EncodedAuthenticationKey) {
    if (config.data) {
      data.data = config.data;
    }

    data.authorization = base64EncodedAuthenticationKey;

    if (twoFactorInfo?.token) {
      data.token = twoFactorInfo.token;
    }
  } else {
    data = config.data;
  }

  if (EnvVarEnum.DEV) {
    console.info("@Request", {
      url: config.url,
      params: config.params,
      data: config.data,
    });
  }

  config.method = "POST";
  config.data = {
    request: CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv,
    }).toString(),
  };

  return config;
});

CoreHttp.interceptors.response.use(
  (response) => {
    if (response.data?.enc) {
      if (response.data?.data) {
        const decryptedWordArr = CryptoJS.AES.decrypt(
          `${response.data?.data}`,
          key,
          {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            iv,
          }
        );
        const decryptedString = decryptedWordArr.toString(CryptoJS.enc.Utf8);
        response.data.data = JSON.parse(decryptedString);
      } else {
        // response.data.data = null;
      }

      if (EnvVarEnum.DEV) {
        console.info("@Response", {
          url: response.config.url,
          params: response.config.params,
          data: response.data,
        });
      }
    }
    if (response?.headers?.["x-notification-refresh"] == "true") {
      triggerNotificaiton();
    }

    return response;
  },
  (error) => {
    if (EnvVarEnum.DEV) {
      if (error?.response) {
        console.info("@Response_Error", {
          url: error?.response.config.url,
          params: error?.response.config.params,
          data: error?.response.data,
          message: error?.response?.data?.message,
        });
      }
    }
    if (error?.response?.headers?.["x-notification-refresh"] == "true") {
      triggerNotificaiton();
    }
    // if (error?.response?.status === 401 || error.message === "Network Error") {
    if (error?.response?.status === 401) {
      store.dispatch(logoutAction());
    }

    return Promise.reject(error);
  }
);

function triggerNotificaiton() {
  // playNotificationSound();
  // store.dispatch(CoreApi.util.invalidateTags([StoreQueryTagEnum.NOTIFICATION]));
}
