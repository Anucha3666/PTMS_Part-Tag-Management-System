import { TProcess } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TProcessState = {
  processes: TProcess[];
};

const initialState: TProcessState = {
  processes: [],
};

const processSlice = createSlice({
  name: "process",
  initialState,
  reducers: {
    setProcesses: (
      state,
      action: PayloadAction<TProcessState["processes"]>
    ) => {
      state.processes = action.payload;
    },
  },
});

export const { setProcesses } = processSlice.actions;

export default processSlice.reducer;
