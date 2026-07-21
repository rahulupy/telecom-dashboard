const API_BASE = "http://localhost:8000/api";

export async function api(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}