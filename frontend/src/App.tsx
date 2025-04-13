import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DevicesPage from "./pages/DevicesPage";
import DeviceDetailsPage from "./pages/DeviceDetailsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/devices" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/devices" element={<DevicesPage />} />
      <Route path="/devices/:id" element={<DeviceDetailsPage />} />
    </Routes>
  );
}
