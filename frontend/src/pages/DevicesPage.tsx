import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../utils/token";

interface Device {
  id: number;
  name: string;
  ip_address: string;
  description?: string;
  is_online: boolean;
  owner_id: number;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const res = await axios.get("/devices");
      setDevices(res.data);
    } catch (err) {
      if ((err as any).response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const owner_id = getUserIdFromToken();
  if (!owner_id) return alert("Nieprawidłowy token użytkownika");

  try {
    const payload = {
      name,
      ip_address: ip,
      description: desc,
      owner_id, // ← dodajemy tutaj!
    };

    if (editingId) {
      await axios.put(`/devices/${editingId}`, payload);
    } else {
      await axios.post("/devices", payload);
    }

    setName("");
    setIp("");
    setDesc("");
    setEditingId(null);
    fetchDevices();
  } catch (err) {
    alert("Błąd zapisu");
  }
};

  const handleEdit = (device: Device) => {
    setName(device.name);
    setIp(device.ip_address);
    setDesc(device.description || "");
    setEditingId(device.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć to urządzenie?")) return;
    try {
      await axios.delete(`/devices/${id}`);
      fetchDevices();
    } catch {
      alert("Błąd usuwania");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zarządzanie urządzeniami</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow rounded">
        <input
          type="text"
          placeholder="Nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Adres IP"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Opis (opcjonalnie)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Zapisz zmiany" : "Dodaj urządzenie"}
        </button>
      </form>

      <div className="bg-white shadow rounded">
        {devices.map((device) => (
          <div
            key={device.id}
            className="border-b p-4 flex justify-between items-center"
          >
            <div>
              <p
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate(`/devices/${device.id}`)}
              >
                {device.name}
              </p>
              <p className="text-sm text-gray-600">{device.ip_address}</p>
              <p className="text-sm text-gray-500">{device.description}</p>
            </div>
            <div className="flex gap-2">
              {device.is_online ? <p className="font-semibold">ONLINE</p> : <p className="font-semibold">OFFLINE</p>}
              
              <span className={`inline-block w-3 h-3 rounded-full ${
                device.is_online ? "bg-green-500" : "bg-red-500"
              }`}
              ></span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(device)}
                className="text-blue-500 hover:underline"
              >
                Edytuj
              </button>
              <button
                onClick={() => handleDelete(device.id)}
                className="text-red-500 hover:underline"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
