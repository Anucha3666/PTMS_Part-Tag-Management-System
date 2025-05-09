import { TPart, TPrintTagPart } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TPrintState = {
  prints: (TPart & TPrintTagPart)[];
};

const initialState: TPrintState = {
  prints: [],
};

const printSlice = createSlice({
  name: "part",
  initialState,
  reducers: {
    setPrints: (state, action: PayloadAction<TPrintState["prints"]>) => {
      state.prints = action.payload;
    },
  },
});

export const { setPrints } = printSlice.actions;

export default printSlice.reducer;
