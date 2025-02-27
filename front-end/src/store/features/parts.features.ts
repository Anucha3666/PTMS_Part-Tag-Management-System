import { TPart } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TPartsState = {
  parts: TPart[];
};

const initialState: TPartsState = {
  parts: [],
};

const partsSlice = createSlice({
  name: "part",
  initialState,
  reducers: {
    setParts: (state, action: PayloadAction<TPartsState["parts"]>) => {
      state.parts = action.payload;
    },
  },
});

export const { setParts } = partsSlice.actions;

export default partsSlice.reducer;
