  import axios from 'axios';

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

