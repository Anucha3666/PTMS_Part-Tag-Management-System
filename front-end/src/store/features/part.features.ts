import { TPart } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TPartState = {
  parts: TPart[];
};

const initialState: TPartState = {
  parts: [],
};

const partSlice = createSlice({
  name: "part",
  initialState,
  reducers: {
    setParts: (state, action: PayloadAction<TPartState["parts"]>) => {
      state.parts = action.payload;
    },
  },
});

export const { setParts } = partSlice.actions;

export default partSlice.reducer;
