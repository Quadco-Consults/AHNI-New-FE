import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { throttle } from "utils/FunctionUtils";
import { isObjectEmpty, deepMerge } from "utils/ObjectUtils";
import { logoutAction, refreshAction } from "./StoreActionConfig";
import { CoreApi, DocumentServiceApi } from "./StoreQueryConfig";
import globalSlice, {
  getGlobalSliceStorageState,
  globalInitialState,
} from "./StoreSliceConfig";
import CryptoJS from "crypto-js";
import { EnvVarEnum } from "constants/Global";
import { StoreQueryTagEnum } from "constants/StoreConstants";

const store = configureStore({
  reducer: {
    [CoreApi.reducerPath]: CoreApi.reducer,
    [DocumentServiceApi.reducerPath]: DocumentServiceApi.reducer,
    [globalSlice.name]: globalSlice.reducer,
  },
  preloadedState: loadState({
    [globalSlice.name]: globalInitialState,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      CoreApi.middleware,
      DocumentServiceApi.middleware,
      rtkqOnResetMiddleware(CoreApi, DocumentServiceApi)
    ),
});

setupListeners(store.dispatch);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({
      [globalSlice.name]: getGlobalSliceStorageState(state[globalSlice.name]),
    });
  }, 1000)
);

export default store;

function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(
      "@state",
      CryptoJS.AES.encrypt(serializedState, EnvVarEnum.AES_ENCRYPTION_KEY)
    );
  } catch (error) {}
}

function loadState(initialState = {}) {
  try {
    const newState = Object.assign({}, initialState);
    const storageState = getLocalStorageState();
    if (storageState && !isObjectEmpty(storageState)) {
      Object.assign(newState, deepMerge(newState, storageState));
    }
    return newState;
  } catch (error) {}
  return undefined;
}

function getLocalStorageState() {
  const serializedState = localStorage.getItem("@state");
  if (serializedState) {
    return JSON.parse(
      CryptoJS.AES.decrypt(
        serializedState,
        EnvVarEnum.AES_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8)
    );
  }
  return null;
}

export function rtkqOnResetMiddleware(...apis) {
  return (store) => (next) => (action) => {
    const result = next(action);
    if (logoutAction.match(action)) {
      for (const api of apis) {
        store.dispatch(api.util.resetApiState());
      }
      localStorage.clear();
      window?.postMessage?.({ type: "LOGOUT" }, window.location.origin);
    }
    if (refreshAction.match(action)) {
      for (const api of apis) {
        store.dispatch(
          api.util.invalidateTags(Object.values(StoreQueryTagEnum))
        );
      }
    }
    return result;
  };
}
