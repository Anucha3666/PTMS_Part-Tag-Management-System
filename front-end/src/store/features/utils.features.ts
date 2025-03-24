import { TAuth } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TUtilsState = {
  dataUser: TAuth;
  isOpenSidebar: boolean;
  isLeft: boolean;
};

const initialState: TUtilsState = {
  dataUser: {} as TAuth,
  isLeft: false,
  isOpenSidebar: true,
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setDataUser: (state, action: PayloadAction<TUtilsState["dataUser"]>) => {
      state.dataUser = action.payload;
    },
    setIsOpenSidebar: (
      state,
      action: PayloadAction<TUtilsState["isOpenSidebar"]>
    ) => {
      state.isOpenSidebar = action.payload;
    },
    setIsLeft: (state, action: PayloadAction<TUtilsState["isLeft"]>) => {
      state.isLeft = action.payload;
    },
  },
});

export const { setDataUser, setIsOpenSidebar } = utilsSlice.actions;

export default utilsSlice.reducer;
