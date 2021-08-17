<style lang="postcss">
</style>

<script lang="ts">
//components
import CredentialSubjectFieldSelector from "./CredentialSubjectFieldSelector.svelte";
import Button from "../lib/Button.svelte";
//stores
import { credentials } from "../stores/credentials";
import { slideOverContent, slidePreviewOverContent } from "../stores/ui";
import Preview from "./Preview.svelte";
import swal from 'sweetalert';

let unique = {} // every {} is unique, {} === {} evaluates to false
let selectedSchemaFields
function clearSelection() {
   unique = {}
}

let credentialsChosen: any

async function presentationPreview(){

  let inputDescriptor: Object = {}
  for (let value of selectedSchemaFields){
    //NOTE: for the next refactor...use str.split and NOT REGEXS YOU WILL NEVER GET THAT TIME BACK
    const reIndex:RegExp = /(?<=\.)(\w*?)(?=\.)/gi 
    const rePayload:RegExp = /(?!\w*\.)(?<=\.)(.*)/gi
    value = value.replace('$.credentialSubject','')
    let regexIndexPayload:string
    let regexIndexValue:string
    console.log(value)
    //$.xxx.key.value format

    if(/(?<=\.)(\w*?)(?=\.)/gi.test(value)){
       regexIndexValue = reIndex.exec(value)[0]
       regexIndexPayload = rePayload.exec(value)[0]

      //building the json object
      if (regexIndexValue in inputDescriptor){
        inputDescriptor[`${regexIndexValue}`].push(regexIndexPayload)
      } else {
        inputDescriptor[`${regexIndexValue}`] = [regexIndexPayload]
      }
    } else {
    //$.xxx.key format
      regexIndexValue = value.slice(1)
      //HACK: ASSUMING THE VALUE WILL REMAIN AN EMPTY OBJECT
      inputDescriptor[`${regexIndexValue}`] = {}
    }

  }
  if (Object.keys(inputDescriptor).length === 0){
    
    swal({
        title: "Empty selection",
        text: "Please select the credential fields you want presented",
        icon: "error",
      })
  } else {

    slidePreviewOverContent.set($slideOverContent);
    slideOverContent.set({
        title:"review",
        component:Preview,
        data:[inputDescriptor,selectedSchemaFields]

      })
    console.log(inputDescriptor)
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
  <Button callback={presentationPreview} type="submit" label='Review'/>
</template>
