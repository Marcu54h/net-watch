import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">NetWatch</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Twój nowoczesny system do monitorowania urządzeń sieciowych.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
        >
          Zaloguj się
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 rounded border border-white hover:bg-white hover:text-black transition"
        >
          Zarejestruj się
        </Link>
      </div>
    </div>
  );
}
