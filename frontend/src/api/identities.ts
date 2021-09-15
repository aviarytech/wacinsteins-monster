import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

export async function getServerIdentity(): Promise<any> {
  try {
    const response = await axios.get(`${baseUrl}/.well-known/did.json`);
    if (response.status == 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return [];
  }
}
