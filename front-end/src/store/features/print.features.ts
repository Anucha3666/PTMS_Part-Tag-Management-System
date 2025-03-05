import { TPrintingHistorys, TPrintTag } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TPrintTagsState = {
  printTags: TPrintTag[];
  printingHistorys: TPrintingHistorys[];
};

const initialState: TPrintTagsState = {
  printTags: [],
  printingHistorys: [],
};

const printSlice = createSlice({
  name: "print",
  initialState,
  reducers: {
    setPrintTags: (
      state,
      action: PayloadAction<TPrintTagsState["printTags"]>
    ) => {
      state.printTags = action.payload;
    },
    setPrintingHistorys: (
      state,
      action: PayloadAction<TPrintTagsState["printingHistorys"]>
    ) => {
      state.printingHistorys = action.payload;
    },
  },
});

export const { setPrintTags, setPrintingHistorys } = printSlice.actions;

export default printSlice.reducer;
