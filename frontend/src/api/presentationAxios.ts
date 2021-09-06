import axios from "axios";
import type { PostPresentationPayload } from "../interfaces";
const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

export async function getPresentations(
  endpoint: string = `${baseUrl}/presentations/requests`
): Promise<any> {
  try {
    const response = await axios.get(endpoint);
    // console.log(response);
    // success
    if (response.status == 200) {
      // test for status you want, etc
      console.log(response.status);
      return response.data;
    }
    // not successfull
    console.log(response.status);
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function postNewPresentationRequest(
  payload: PostPresentationPayload,
  endpoint: string = `${baseUrl}/presentations/definitions`
): Promise<any> {
  try {
    const definitionsResponse = await axios.post(endpoint, payload);
    if (definitionsResponse.status == 201) {
      const requestResponse = await axios.post(
        `${baseUrl}/presentations/requests`,
        { presentationDefinitionId: definitionsResponse.data.id }
      );
      if (requestResponse.status == 201) {
        if (import.meta.env.VITE_ENV_TYPE === "dev") {
          console.log(definitionsResponse.status);
          console.log(definitionsResponse.data);
          console.log(requestResponse.data);
        }
        return requestResponse.data;
      }
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}
