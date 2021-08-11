  import axios from 'axios';
  import type { PostPresentationPayload } from 'src/interfaces';
  let baseUrl:string = "http://localhost:3100"
  export async function getPresentations(endpoint:string=`${baseUrl}/presentations/requests`): Promise<any> {
    try {
      const response = await axios.get(endpoint);
      // console.log(response);
      // success
      if(response.status == 200){
          // test for status you want, etc
        console.log(response.status)
        return response.data
      }
      //not successfull
      console.log(response.status)
      return []
    } catch (error) {
      console.error(error);
      return []
    }
  }

  export async function postNewPresentationRequest(payload:PostPresentationPayload,endpoint:string=`${baseUrl}/presentations/requests`):Promise<any> {
  try {
    console.log(endpoint)
    const response = await axios.post(endpoint, payload)
    if(response.status == 201){
      console.log(response.status)
      return response.data
    }
  } catch  (error) {
      console.error(error);
  }
}
