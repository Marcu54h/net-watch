import client from "./client";

export const getDevices = async () => {
  const res = await client.get("/devices/");
  return res.data;
};

export const createDevice = async (device: { name: string; ip_address: string; description?: string }) => {
  const res = await client.post("/devices/", device);
  return res.data;
};

export const updateDevice = async (id: number, device: any) => {
  const res = await client.put(`/devices/${id}`, device);
  return res.data;
};

export const deleteDevice = async (id: number) => {
  const res = await client.delete(`/devices/${id}`);
  return res.data;
};

export const getHistory = async (id: number) => {
  const res = await client.get(`/devices/${id}/history`);
  return res.data;
};
