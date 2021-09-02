import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `https://api.${window.location.hostname}`

export async function getCurrentConversation(
  payload:Object,                                           
  endpoint: string = `${baseUrl}/messages-api`
): Promise<any> {
  try {
    const msgResponse = await axios.get(`${endpoint}/conversation/${payload}`);
    if (msgResponse.status == 200) {
      //console.log(msgResponse.data)
      return msgResponse.data
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}

export async function postNewMsg2Conversation(
  payload:Object,                                           
  endpoint: string = `${baseUrl}/messages-api`
): Promise<any> {
  try {
    const msgResponse = await axios.post(endpoint,payload);
    if (msgResponse.status == 200) {
      //console.log(msgResponse.data)
      return msgResponse.data
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}
