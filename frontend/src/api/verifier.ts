import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

export const verifyVC = async (credential): Promise<boolean> => {
  const endpoint = baseUrl + "/verifier/credentials/verify";
  try {
    const response = await axios.post(endpoint, {
      verifiableCredential: credential,
      options: {},
    });
    // success
    if (response.status == 201 || 200) {
      // test for status you want, etc
      console.log(response.data);
      return response.data;
    }
    // not successfull
    console.log(response.status);
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
