import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login/Login";
import Formulas from "./Pages/Formulas/Formulas";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import MainLayout from "./Pages/MainLayout/MainLayout";
import ImportFormulas from "./Pages/ImportFormulas/ImportFormulas";
import InkCalculator from "./Pages/InkCalculator/InkCalculator";
import EmailVerification from "./Pages/EmailVerification/EmailVerification";

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route index path="formulas" element={<Formulas />} />
        <Route index path="admin" element={<AdminDashboard />} />
        <Route index path="import" element={<ImportFormulas />} />
        <Route index path="calculator" element={<InkCalculator />} />
      </Route>
      <Route path="*" element={<Navigate to="login" />} />
      <Route path="verification/:verificationCode" element={<EmailVerification />} />
    </Routes>
  );
}
