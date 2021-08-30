import axios from "axios";
const baseUrl: string | boolean = import.meta.env.VITE_API_URL;

export async function postNewContact(
  payload: Object,
  endpoint: string = `${baseUrl}/contacts`
): Promise<any> {
  try {
    const contactResponse = await axios.post(endpoint, payload);
    if (contactResponse.status == 201) {
      console.log(contactResponse.data)
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}
