const API_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8000";

export async function postData(path, data) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (!response.ok) throw new Error(res.message || "Request failed");
  return res;
}
