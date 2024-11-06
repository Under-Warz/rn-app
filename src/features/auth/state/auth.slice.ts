import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

type AuthState = {
  login: string | null;
  password: string | null;
  apiHostname: string | null;
  token: string | null;
  expiration: string | null;
};

const initialState: AuthState = {
  login: null,
  password: null,
  token: null,
  expiration: null,
  apiHostname: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload,
      }: PayloadAction<{
        login: string;
        password: string;
      }>
    ) => ({
      ...state,
      login: payload.login,
      password: payload.password,
    }),
    setApiHostname: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      apiHostname: payload,
    }),
    setToken: (
      state,
      {
        payload: { token, expiration },
      }: PayloadAction<{
        token: string;
        expiration: string;
      }>
    ) => ({
      ...state,
      token,
      expiration,
    }),
    signOut: (state) => ({
      ...state,
      token: null,
      expiration: null,
    }),
  },
});

export const { setCredentials, setApiHostname, setToken, signOut } =
  slice.actions;

export const selectApiHostname = (state: RootState) => state.auth.apiHostname;
export const selectCredentials = (state: RootState) => ({
  login: state.auth.login,
  password: state.auth.password,
});
export const selectIsLoggedIn = (state: RootState) => !!state.auth.token;

export default slice.reducer;
