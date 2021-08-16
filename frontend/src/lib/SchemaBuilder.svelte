<style lang="postcss">
</style>

<script lang="ts">
// interfaces
import type { PostPresentationPayload } from "../interfaces";
//component
import CredentialSubjectFieldSelector from "./CredentialSubjectFieldSelector.svelte";
//stores
import { credentials } from "../stores/credentials";
//api
import { postNewPresentationRequest } from "../api/presentationAxios";

let unique = {} // every {} is unique, {} === {} evaluates to false
let selectedSchemaFields
function clearSelection() {
   unique = {}
}

let credentialsChosen: any

async function presentationPostRequest() {
  if (selectedSchemaFields !== "") {

    let postPayload: PostPresentationPayload = {
      name: credentialsChosen.data.name,
      schema: "https://w3id.org/vaccination#VaccinationCertificate",// TODO: make it more generic !!!!!IMPORTANT //grab context from credentialsChosen
      paths: selectedSchemaFields,
    };
    console.log(postPayload);
    let res = await postNewPresentationRequest(postPayload);
    console.log(res.status)
    //window.location.reload()
  } else {
    alert("please select a schema");
  }
}
</script>

<template>
  <h2>Schema builder</h2>
  <form>
    <h3 id="cy-name">Name</h3>
    <input type="text" placeholder="my name is..." id="cy-name-hook-input" />
    <h3 id="cy-schema">Schema</h3>
    <select
      bind:value={credentialsChosen}
      on:change={() => clearSelection()}
      id="cy-schema-hook-select">
  
      {#each $credentials as item}
        <option value={item}>
          {item['data'].name}
        </option>
      {/each}
    </select>
    <h3>Fields</h3>
    {#if credentialsChosen }
      {#key unique}
        <CredentialSubjectFieldSelector credentialSubject={credentialsChosen['data'].credentialSubject} bind:selected={selectedSchemaFields}/>
        {selectedSchemaFields}
      {/key}
    {:else}
      <h2 id="cy-error-msg" class="bg-yellow-500 rounded-lg max-w-prose">
        Please select a schema
      </h2>
    {/if}
  </form>
  <button
    type="submit"
    on:click={presentationPostRequest}
    class="bg-red-400 rounded-lg max-w-prose">
    Submit
  </button>
</template>
