import "./index.scss";
import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { services } from "./State/services.ts";
import {
  BrowserRouter,
  // createBrowserRouter,
  // RouterProvider,
} from "react-router-dom";
// import { Login } from "./Pages/Login/Login.tsx";
// import Header from "./Components/HeaderAndMainLayout/Header.tsx";
// import Formulas from "./Pages/Formulas/Formulas.tsx";
// import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.tsx";

import { NextUIProvider } from "@nextui-org/system";

export const store = configureStore({
  reducer: { [services.reducerPath]: services.reducer },
  middleware: (getDefault) => getDefault().concat(services.middleware),
});

setupListeners(store.dispatch);

// const router = createBrowserRouter([
//   { path: "*", element: <Login /> },
//   { path: "/", element: <Login /> },
//   {
//     path: "/",
//     element: <Header />,
//     children: [
//       {
//         path: "formulas",
//         element: <Formulas />,
//       },
//       {
//         path: "admin",
//         element: <AdminDashboard />,
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        {/* <RouterProvider router={router}></RouterProvider> */}
        <BrowserRouter>
          <App></App>
        </BrowserRouter>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);
