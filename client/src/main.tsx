import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Pages/Login/Login.tsx";
import Header from "./Components/HeaderAndMainLayout/Header.tsx";
import Formulas from "./Pages/Formulas/Formulas.tsx";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.tsx";

import { NextUIProvider } from "@nextui-org/system";

const router = createBrowserRouter([
  { path: "*", element: <Login /> },
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path: "formulas",
        element: <Formulas />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router}></RouterProvider>
    </NextUIProvider>
  </React.StrictMode>
);
