import { configureStore }
from "@reduxjs/toolkit";

import companyReducer
from "./slices/companySlice";

export const store =
  configureStore({
    reducer: {
      company: companyReducer,
    },
  });