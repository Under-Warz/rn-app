import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

type UploadState = {
  progress: number | null;
};

const initialState: UploadState = {
  progress: 0,
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setUploadProgress: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      progress: payload,
    }),
  },
});

export const { setUploadProgress } = slice.actions;

export const selectUploadProgress = (state: RootState) => state.upload.progress;

export default slice.reducer;
