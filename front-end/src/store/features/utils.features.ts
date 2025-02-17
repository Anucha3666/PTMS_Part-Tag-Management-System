import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TUtilsState = {
  state: string;
};

const initialState: TUtilsState = {
  state: "",
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<string>) => {
      state.state = action.payload;
    },
  },
});

export const { setState } = utilsSlice.actions;

export default utilsSlice.reducer;
