<script lang='ts'>
  // interfaces
  import type { PostPresentationPayload } from '../interfaces';
  //stores
  import { vaccinationJsonLD } from '../stores/schema'
  //api
  import { postNewPresentationRequest } from '../api/presentationAxios';

  let index:number = -1
  let schemaChossen:string = ''
  $: if(schemaChossen !== ''){
      index = $vaccinationJsonLD.findIndex((x) => x.name === schemaChossen)//implicit return
    } 

  async function presentationPostRequest() {
    if(schemaChossen !== ''){
      
      let checkedKeys:string[] = Object.keys(
        $vaccinationJsonLD[index].fields).filter(
          (key) => $vaccinationJsonLD[index].fields[key])

      checkedKeys.forEach( (val, i) => {checkedKeys[i]=`$.${schemaChossen}.${val}`})
      
      let postPayload:PostPresentationPayload = {
          name:schemaChossen,
          schema:$vaccinationJsonLD[index].schema,
          paths:checkedKeys
        }
      // WARN:for debug only. (need to add a production flag or something)
      console.log(postPayload)
      let res = await postNewPresentationRequest(postPayload)
      //console.log(res.status)
      // WARN:for debug only. (need to add a production flag or something)
      //window.location.reload()
    } else {
      alert('please select a schema')
    }

  }
</script>

<template>

  <h2>Schema builder</h2>
  <form>
    <h3 id="cy-name">Name</h3>
    <input type="text" placeholder="my name is..." id="cy-name-hook-input"/>
    <h3 id="cy-schema">Schema</h3>
      <select bind:value={schemaChossen} on:change={() => console.log(schemaChossen)} id='cy-schema-hook-select'>
        {#each $vaccinationJsonLD as item}
          <option value={item.name}>
            {item.name}
          </option>
        {/each}
      </select>
    <h3>Fields</h3>
    {#if schemaChossen !== ''}
    <h3> Schema reference: {schemaChossen}</h3>

    <ul id='cy-checkbox-check'>
      {#each Object.keys($vaccinationJsonLD[index].fields) as key}
        <li><input type=checkbox bind:checked={$vaccinationJsonLD[index].fields[key]}> {key}</li><!-- this is the html element, checked (boolean equivalent in html)-->
      {/each}
    </ul>
    {:else}
      <h2 id='cy-error-msg'class="bg-yellow-500 rounded-lg max-w-prose">Please select a schema</h2>
    {/if}
    
  </form>
  <button type="submit" on:click={presentationPostRequest} class="bg-red-400 rounded-lg max-w-prose">
    Submit
  </button>
</template>

<style lang='postcss'>

</style>
