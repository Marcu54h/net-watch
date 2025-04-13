import client from "./client";

export const register = async (email: string, password: string) => {
  const res = await client.post("/register", { email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await client.post("/token", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem("token", res.data.access_token);
  return res.data;
};
