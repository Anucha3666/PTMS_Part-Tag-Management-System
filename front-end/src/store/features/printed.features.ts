import { TPrintedTag } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TPrintedState = {
  printeds: TPrintedTag[];
};

const initialState: TPrintedState = {
  printeds: [],
};

const printedSlice = createSlice({
  name: "printed",
  initialState,
  reducers: {
    setPrinted: (state, action: PayloadAction<TPrintedState["printeds"]>) => {
      state.printeds = action.payload;
    },
  },
});

export const { setPrinted } = printedSlice.actions;

export default printedSlice.reducer;
