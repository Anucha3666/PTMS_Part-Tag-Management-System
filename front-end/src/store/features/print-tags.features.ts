import { TPrintTag } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TPrintTagsState = {
  printTags: TPrintTag[];
};

const initialState: TPrintTagsState = {
  printTags: [],
};

const printTagsSlice = createSlice({
  name: "printTags",
  initialState,
  reducers: {
    setPrintTags: (
      state,
      action: PayloadAction<TPrintTagsState["printTags"]>
    ) => {
      state.printTags = action.payload;
    },
  },
});

export const { setPrintTags } = printTagsSlice.actions;

export default printTagsSlice.reducer;
