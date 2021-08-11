import axios from "axios";

export async function getAllCredentials(): Promise<any> {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/credentials"
    );
    // console.log(response);
    if (response.status == 200) {
      // test for status you want, etc
      return response.data;
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}
