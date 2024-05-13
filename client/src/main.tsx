import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { api } from "./State/api.tsx";
import "./index.scss";

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
