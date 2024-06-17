import "./index.scss";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { api } from "./State/api.tsx";
import { NextUIProvider } from "@nextui-org/system";
import { AuthProvider } from "./Context/AuthProvider.tsx";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <AuthProvider>
      <NextUIProvider>
        <BrowserRouter>
          <App></App>
        </BrowserRouter>
      </NextUIProvider>
    </AuthProvider>
  </Provider>
  //  </React.StrictMode>
);
