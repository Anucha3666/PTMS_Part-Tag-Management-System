import { combineReducers, configureStore } from "@reduxjs/toolkit";

import accountFeatures from "./features/account.features";
import partFeatures from "./features/part.features";
import printedFeatures from "./features/printed.features";
import tagFeatures from "./features/tag.features";
import utilsFeatures from "./features/utils.features";

const rootReducer = combineReducers({
  utils: utilsFeatures,
  account: accountFeatures,
  part: partFeatures,
  printed: printedFeatures,
  tag: tagFeatures,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Export types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
