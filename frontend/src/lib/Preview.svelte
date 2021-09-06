<style lang="postcss">
</style>

<script lang="ts">
export let data: object;
//components
import Button from "./ui/Button.svelte";
//api
import { postNewPresentationRequest } from "../api/presentationAxios";
// interfaces
import type { PostPresentationPayload } from "../interfaces";

async function presentationPostRequest() {
  let postPayload: PostPresentationPayload = {
    schema: "https://w3id.org/vaccination#VaccinationCertificate",
    // TODO: make it more generic //grab context from credentialsChosen
    paths: data[1], //selected schema fields
  };
  let res = await postNewPresentationRequest(postPayload);
  window.location.reload();
}
</script>

<pre>{JSON.stringify(data[0],null,2)}</pre>

<Button label="submit" callback="{presentationPostRequest}" />
