import "./index.scss";
import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./State/api.tsx";
import { BrowserRouter } from "react-router-dom";

import { NextUIProvider } from "@nextui-org/system";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <NextUIProvider>
      <BrowserRouter>
        <App></App>
      </BrowserRouter>
    </NextUIProvider>
  </Provider>
  //  </React.StrictMode>
);
