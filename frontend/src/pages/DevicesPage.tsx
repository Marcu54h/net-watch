import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function DevicesPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/devices");
    } catch {
      alert("Błąd logowania");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Logowanie</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="border p-2 w-full mb-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło"
          className="border p-2 w-full mb-4" />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">Zaloguj</button>
      </form>
    </div>
  );
}
