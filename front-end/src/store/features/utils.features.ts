import { TAuth } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TUtilsState = {
  dataUser: TAuth;
};

const initialState: TUtilsState = {
  dataUser: {} as TAuth,
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setDataUser: (state, action: PayloadAction<TUtilsState["dataUser"]>) => {
      state.dataUser = action.payload;
    },
  },
});

export const { setDataUser } = utilsSlice.actions;

export default utilsSlice.reducer;
