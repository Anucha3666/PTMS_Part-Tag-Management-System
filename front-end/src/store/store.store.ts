import { combineReducers, configureStore } from "@reduxjs/toolkit";

import accountFeatures from "./features/account.features";
import customerFeatures from "./features/customer.features";
import partFeatures from "./features/part.features";
import printFeatures from "./features/print.features";
import printedFeatures from "./features/printed.features";
import processFeatures from "./features/process.features";
import tagFeatures from "./features/tag.features";
import utilsFeatures from "./features/utils.features";

const rootReducer = combineReducers({
  utils: utilsFeatures,
  account: accountFeatures,
  process: processFeatures,
  customer: customerFeatures,
  part: partFeatures,
  print: printFeatures,
  printed: printedFeatures,
  tag: tagFeatures,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Export types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
