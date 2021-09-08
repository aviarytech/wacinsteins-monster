import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

export async function reset() {
  const res = await axios.post(`${baseUrl}/admin/drop-db`);
  return;
}
