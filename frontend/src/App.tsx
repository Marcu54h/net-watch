import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // ✅
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DevicesPage from "./pages/DevicesPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />          {/* ✅ Tu strona startowa */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/devices" element={<DevicesPage />} />
      </Routes>
  );
}

export default App;
