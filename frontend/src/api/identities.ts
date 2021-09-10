import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

export async function getAllIdentities(start: any[]): Promise<any> {
  try {
    let identities = start;
    const response = await axios.get(`${baseUrl}/.well-known/did.json`);
    if (response.status == 200) {
      identities = [...identities, response.data.id];
    }
    return identities;
  } catch (error) {
    console.error(error);
    return [];
  }
}
