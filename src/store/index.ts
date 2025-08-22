import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const middlewareHandler = (getDefaultMiddleware: any) => {
  const middlewareList = [
    // ...your middleware here
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  ];

  return middlewareList;
};

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) =>
      middlewareHandler(getDefaultMiddleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

export const store = makeStore();

export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
