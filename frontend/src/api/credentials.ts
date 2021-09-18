import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

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

export async function deriveCredential(
  credentialId: string,
  verifiableCredential: object,
  frame: object
): Promise<any> {
  try {
    const response = await axios.post(`${baseUrl}/credentials/derive`, {
      credentialId,
      verifiableCredential,
      frame,
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
