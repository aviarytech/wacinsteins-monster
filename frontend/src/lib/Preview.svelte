<style lang="postcss">
</style>

<script lang="ts">
export let data: object;
//components
import Button from "./ui/Button.svelte";
//api
import {
  getPresentations,
  postNewPresentationRequest,
} from "../api/presentationAxios";
// interfaces
import type { PostPresentationPayload } from "../interfaces";
import { presentations } from "../stores/presentation";
import { slideOverContent } from "../stores/ui";

async function presentationPostRequest() {
  let postPayload: PostPresentationPayload = {
    schema: "https://w3id.org/vaccination#VaccinationCertificate",
    // TODO: make it more generic //grab context from credentialsChosen
    paths: data[1], //selected schema fields
    frame: data[0],
  };
  await postNewPresentationRequest(postPayload);
  const res = await getPresentations();
  if (res) {
    presentations.set(res);
  }
  slideOverContent.set(null);
}
</script>

<pre>{JSON.stringify(data[0],null,2)}</pre>

<Button
  additionalClasses="mt-6"
  label="Submit"
  callback="{presentationPostRequest}" />
