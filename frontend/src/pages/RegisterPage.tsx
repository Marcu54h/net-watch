import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/register", {
        email,
        password,
      }).then(response => (console.log(response.data)));

      // Możesz przekierować na stronę logowania po udanej rejestracji
      alert("Rejestracja zakończona sukcesem. Zaloguj się teraz.");
      navigate("/login");
    } catch (error: any) {
      // Obsługa błędów w przypadku nieudanej rejestracji
      console.error("Błąd rejestracji:", error);
      alert("Błąd rejestracji. Spróbuj ponownie.");
    }
  };

  // Zmienna, która sprawdza, czy oba pola są wypełnione
  const isFormValid = email !== "" && password !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 shadow-md rounded max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Rejestracja</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          className="border p-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
          disabled={!isFormValid} // Przycisk jest aktywny tylko, gdy oba pola są wypełnione
        >
          Zarejestruj
        </button>
      </form>
    </div>
  );
}
