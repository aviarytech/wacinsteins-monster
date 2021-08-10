  import axios from 'axios';
  import type { PostPresentationPayload } from 'src/interfaces';
  let baseUrl:string = "http://localhost:3100"
  export async function getCall(url:string): Promise<any> {
    try {
      const response = await axios.get(url);
      // console.log(response);
      if(response.status == 200){
          // test for status you want, etc
          console.log(response.status)
      }
      return response.data
    } catch (error) {
      console.error(error);
    }
  }

  export async function postNewPresentationRequest(payload:PostPresentationPayload,endpoint:string=`${baseUrl}/presentations`):Promise<any> {
  try {
    console.log(endpoint)
    const response = await axios.post(endpoint, payload)
    if(response.status == 201){
        // test for status you want, etc
        console.log(response.status)
    }
    return response.data
  } catch  (error) {
      console.error(error);
  }
}
