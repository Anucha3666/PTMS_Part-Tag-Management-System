import { TAccount } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TAccountState = {
  accounts: TAccount[];
};

const initialState: TAccountState = {
  accounts: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<TAccountState["accounts"]>) => {
      state.accounts = action.payload;
    },
  },
});

export const { setAccounts } = accountSlice.actions;

export default accountSlice.reducer;
