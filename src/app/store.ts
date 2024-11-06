import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { persistReducer, persistStore } from "redux-persist";
import { streamlikeApi } from "@/app/services/streamlike";
import auth from "@/features/auth/state/auth.slice";
import logs from "@/features/settings/state/logs.slice";
import upload from "@/features/upload/state/upload.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const reducers = combineReducers({
  [streamlikeApi.reducerPath]: streamlikeApi.reducer,
  auth,
  logs,
  upload,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const middlewares = [streamlikeApi.middleware];

if (__DEV__) {
  const createDebugger = require("redux-flipper").default;
  middlewares.push(createDebugger());
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middlewares),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
