import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `https://api.${window.location.hostname}`

export async function getAllCredentials(): Promise<any> {
  try {
    const response = await axios.get(`${baseUrl}/credentials`);
    // console.log(response);
    if (response.status == 200) {
      // test for status you want, etc
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
