import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import dayjs from "dayjs";

export type Log = {
  datetime: string;
  message: string;
};

type LogsState = Log[];

const initialState: LogsState = [];

const slice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addEntry: (state, { payload }: PayloadAction<string>) => [
      ...state,
      {
        datetime: dayjs().toISOString(),
        message: payload,
      },
    ],
    clear: () => initialState,
  },
});

export const { addEntry, clear } = slice.actions;

export const selectEntries = (state: RootState) =>
  [...state.logs].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

export default slice.reducer;
