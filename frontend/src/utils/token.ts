export function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return parseInt(payload.sub);
  } catch (e) {
    console.error("Nie można odczytać user_id z tokena", e);
    return null;
  }
}
