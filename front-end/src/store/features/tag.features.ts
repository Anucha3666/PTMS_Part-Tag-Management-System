import { TTag } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TTagState = {
  tags: TTag[];
};

const initialState: TTagState = {
  tags: [],
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<TTagState["tags"]>) => {
      state.tags = action.payload;
    },
  },
});

export const { setTags } = tagSlice.actions;

export default tagSlice.reducer;
