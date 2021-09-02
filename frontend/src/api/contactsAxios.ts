import axios from "axios";
import { slideOverContent } from "../stores/ui";

const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `https://api.${window.location.hostname}`


export async function postNewContact(
  payload: Object,
  endpoint: string = `${baseUrl}/contacts`
): Promise<any> {
  try {
    const contactResponse = await axios.post(endpoint, payload);
    if (contactResponse.status == 201) {
      slideOverContent.set(null)
      //NOTE: is there a better way? destroy and reload the component?
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}

export async function deleteContact(
  payload: Object,
  endpoint: string = `${baseUrl}/contacts`
): Promise<any> {
  try {
    const contactResponse = await axios.delete(`${endpoint}/${payload}`);
    if (contactResponse.status == 200) {
      //console.log(contactResponse.data)
      return contactResponse.data
    }
    return [];
  } catch (error) {
    console.error(error);
  }

}

export async function getContacts(
  endpoint: string = `${baseUrl}/contacts`
): Promise<any> {
  try {
    const contactResponse = await axios.get(endpoint);
    if (contactResponse.status == 200) {
      return contactResponse.data;
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}
