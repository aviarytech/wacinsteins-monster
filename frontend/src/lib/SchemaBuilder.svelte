<style lang="postcss">
</style>

<script lang="ts">
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

let unique = {}; // every {} is unique, {} === {} evaluates to false
let selectedSchemaFields: string[];
function clearSelection() {
  unique = {};
}

let credentialsChosen: any;

async function presentationPreview() {
  let inputDescriptor: Object = {
    credentialSubject: inputDescriptionBuilder(
      selectedSchemaFields,
      credentialsChosen["verifiableCredential"]["credentialSubject"]
    ),
  };
  inputDescriptor["type"] = credentialsChosen["verifiableCredential"]["type"];
  inputDescriptor["@context"] =
    credentialsChosen["verifiableCredential"]["@context"];

  if (Object.keys(inputDescriptor).length === 0) {
    swal({
      title: "Empty selection",
      text: "Please select the credential fields you want presented",
      icon: "error",
    });
  } else {
    slidePreviewOverContent.set($slideOverContent);
    slideOverContent.set({
      title: "Review",
      component: Preview,
      data: [inputDescriptor, selectedSchemaFields],
    });
  }
}
</script>

<template>
  <form>
    <h3 id="cy-schema">Schema</h3>
    <select
      bind:value="{credentialsChosen}"
      on:change="{() => clearSelection()}"
      id="cy-schema-hook-select">
      {#each $credentials as item}
        <option value="{item}">
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
      <h2 id="cy-error-msg" class="bg-yellow-500 rounded-lg max-w-prose">
        Please select a schema
      </h2>
    {/if}
  </form>
  <Button
    additionalClasses="mt-6"
    callback="{presentationPreview}"
    type="submit"
    label="Review" />
</template>
