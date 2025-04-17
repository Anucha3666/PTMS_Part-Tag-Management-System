import { TCustomer } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TCustomerState = {
  customers: TCustomer[];
};

const initialState: TCustomerState = {
  customers: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (
      state,
      action: PayloadAction<TCustomerState["customers"]>
    ) => {
      state.customers = action.payload;
    },
  },
});

export const { setCustomers } = customerSlice.actions;

export default customerSlice.reducer;
