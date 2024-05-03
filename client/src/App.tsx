import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login/Login";
import Formulas from "./Pages/Formulas/Formulas";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import Header from "./Components/HeaderAndMainLayout/Header";

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<Header />}>
        <Route index path="formulas" element={<Formulas />} />
        <Route index path="admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
}
