<style lang="postcss">
</style>

<script lang="ts">
import jsonld from "jsonld";
//components
import CredentialSubjectFieldSelector from "./CredentialSubjectFieldSelector.svelte";
import Button from "../lib/ui/Button.svelte";
import Preview from "./Preview.svelte";
//stores
import { credentials } from "../stores/credentials";
import { slideOverContent, slidePreviewOverContent } from "../stores/ui";
//js imports
import swal from "sweetalert";
import inputDescriptionBuilder from "../utils/frameBuilder";
import {
  getPresentations,
  postNewPresentationRequest,
} from "../api/presentationAxios";
import { presentations, qrCodeIdValue } from "../stores/presentation";
import QRcode from "./QRcode.svelte";

let unique = {}; // every {} is unique, {} === {} evaluates to false
let selectedSchemaFields: string[];
function clearSelection() {
  unique = {};
}

let credentialsChosenId: string;
$: credentialsChosen = $credentials.find((c) => c.id === credentialsChosenId);

async function submitPresentation() {
  let inputDescriptor: object = {
    credentialSubject: inputDescriptionBuilder(
      selectedSchemaFields,
      credentialsChosen["verifiableCredential"]["credentialSubject"]
    ),
  };
  inputDescriptor["type"] = credentialsChosen["verifiableCredential"]["type"];
  inputDescriptor["@context"] =
    credentialsChosen["verifiableCredential"]["@context"];
  const compacted = await jsonld.compact(
    credentialsChosen["verifiableCredential"],
    {}
  );
  const schema = compacted["@type"].filter(
    (t) => t !== "https://www.w3.org/2018/credentials#VerifiableCredential"
  );
  if (schema.length > 1) {
    swal({
      title: "Too Many Schemas",
      text: "There are too many schemas on this credential",
      icon: "error",
    });
  } else {
    if (Object.keys(inputDescriptor).length === 0) {
      swal({
        title: "Empty selection",
        text: "Please select the credential fields you want presented",
        icon: "error",
      });
    } else {
      const newPres = await postNewPresentationRequest({
        schema: schema[0],
        paths: selectedSchemaFields,
        frame: inputDescriptor,
      });
      qrCodeIdValue.set(newPres.url);
      const res = await getPresentations();
      if (res) {
        presentations.set(res);
      }
      slideOverContent.set({
        title: ``,
        component: QRcode,
      });
    }
  }
}
</script>

<template>
  <form>
    <h3 id="cy-schema">Schema</h3>
    <select
      bind:value="{credentialsChosenId}"
      on:change="{() => clearSelection()}"
      id="cy-schema-hook-select">
      {#each $credentials as item}
        <option value="{item.id}">
          {item["verifiableCredential"].name}
        </option>
      {/each}
    </select>
    <div class="text-md font-semibold text-gray-500 mt-2">Select Fields</div>
    {#if credentialsChosen}
      {#key unique}
        <CredentialSubjectFieldSelector
          credentialSubject="{credentialsChosen['verifiableCredential']
            .credentialSubject}"
          bind:selected="{selectedSchemaFields}" />
      {/key}
    {:else}
      <h2 id="cy-error-msg" class="bg-gray-300 rounded-xs p-3">
        Please select a schema
      </h2>
    {/if}
  </form>
  <Button
    additionalClasses="mt-6"
    callback="{submitPresentation}"
    type="submit"
    label="Submit" />
</template>
