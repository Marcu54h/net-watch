import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Przygotowanie danych formularza
      const formData = new URLSearchParams();
      formData.append("username", email);  // username to wymagana nazwa parametru
      formData.append("password", password);

      // Wysłanie zapytania POST
      const response = await axios.post("/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",  // Właściwy nagłówek
        },
      });

      // Przechowywanie tokenu w localStorage
      localStorage.setItem("token", response.data.access_token);

      // Przekierowanie po udanym logowaniu
      navigate("/devices");
    } catch (error: any) {
      // Obsługa błędów
      if (error.response && error.response.status === 400) {
        alert("Nieprawidłowy login lub hasło.");
      } else {
        alert("Wystąpił błąd. Spróbuj ponownie.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-40">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Logowanie</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}
