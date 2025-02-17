import { combineReducers, configureStore } from "@reduxjs/toolkit";

import utilsFeatures from "./features/utils.features";
import partsFeatures from "./features/parts.features";

const rootReducer = combineReducers({
  utils: utilsFeatures,
  parts: partsFeatures,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Export types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
