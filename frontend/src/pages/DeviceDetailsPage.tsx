import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface PingRecord {
  timestamp: string;
  status: boolean;
}

interface Device {
  id: number;
  name: string;
  ip_address: string;
  description?: string;
  is_online: boolean;
  owner_id: number;
}

export default function DeviceDetailPage() {
  const { id } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [history, setHistory] = useState<PingRecord[]>([]);
  const sampledHistory = history.filter((_, index) => index % 10 === 0);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    // const interval = setInterval(() => {
    //   fetchData();
    // }, 30000); // co 30 sekund
  fetchData();
  // return () => clearInterval(interval); // czyścimy przy odmontowaniu
}, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deviceRes, historyRes] = await Promise.all([
        axios.get(`/devices/${id}`),
        axios.get(`/devices/${id}/history`)
      ]);
      setDevice(deviceRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Błąd pobierania danych", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/devices/${id}`, {
        name: device?.name,
        ip_address: device?.ip_address,
        description: device?.description
      });
      alert("Zapisano zmiany");
      fetchData();
    } catch (err) {
      alert("Błąd zapisu");
    }
  };

  if (loading || !device) return <p className="p-6">Ładowanie...</p>;

  // uptime %
  const total = history.length;
  const online = history.filter((h) => h.status).length;
  const uptime = total ? ((online / total) * 100).toFixed(1) : "0";

  // chart data
const chartData = {
  labels: sampledHistory.map((h) =>new Date(h.timestamp).toLocaleTimeString("pl-PL")),
  datasets: [
    {
      label: "Status",
      data: sampledHistory.map((h) => (h.status ? 1 : 0)),
        borderColor: "rgb(75,192,192)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          callback: (value: number) => (value === 1 ? "Online" : "Offline"),
        },
        min: 0,
        max: 1,
        stepSize: 1,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.raw === 1 ? "Online" : "Offline";
          },
        },
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Szczegóły urządzenia</h1>

      <form onSubmit={handleUpdate} className="space-y-3 mb-6">
        <input
          type="text"
          value={device.name}
          onChange={(e) => setDevice({ ...device, name: e.target.value })}
          className="border p-2 w-full"
          placeholder="Nazwa"
        />
        <input
          type="text"
          value={device.ip_address}
          onChange={(e) => setDevice({ ...device, ip_address: e.target.value })}
          className="border p-2 w-full"
          placeholder="Adres IP"
        />
        <input
          type="text"
          value={device.description || ""}
          onChange={(e) => setDevice({ ...device, description: e.target.value })}
          className="border p-2 w-full"
          placeholder="Opis"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Zapisz zmiany
        </button>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-block w-3 h-3 rounded-full ${
          device.is_online ? "bg-green-500" : "bg-red-500"
        }`}></span>
        <p>Status: <strong>{device.is_online ? "Online" : "Offline"}</strong></p>
        <p className="ml-4">Uptime: <strong>{uptime}%</strong></p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Historia dostępności</h2>
        {history.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>Brak danych.</p>
        )}
      </div>
    </div>
  );
}
