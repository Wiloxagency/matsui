import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login/Login";
import Formulas from "./Pages/Formulas/Formulas";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import Header from "./Components/HeaderAndMainLayout/Header";
import ImportFormulas from "./Pages/ImportFormulas/ImportFormulas";
// import { useEffect } from "react";

export default function App() {
  // const wakeUpApi = async () => {
  //   const res = await fetch(import.meta.env.VITE_API_URL  + "wakeUpServer");
  //   console.log(res)
  // };

  // wakeUpApi();

  // useEffect(() => {
  //   const intervalCall = setInterval(() => {
  //     wakeUpApi();
  //   }, 900000);
  //   return () => {
  //     clearInterval(intervalCall);
  //   };
  // }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<Header />}>
        <Route index path="formulas" element={<Formulas />} />
        <Route index path="admin" element={<AdminDashboard />} />
        <Route index path="import" element={<ImportFormulas />} />
      </Route>
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
}
