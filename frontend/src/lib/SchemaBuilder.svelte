<script lang='ts'>
  // interfaces
  import type { PostPresentationPayload } from 'src/interfaces';
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
      //console.log($vaccinationJsonLD[index].fields)
      let checkedKeys:Array<string> = Object.keys(
        $vaccinationJsonLD[index].fields).filter(
          (key) => $vaccinationJsonLD[index].fields[key])
      //console.log(checkedKeys)
      checkedKeys.forEach( (val, i) => {checkedKeys[i]=`$.${schemaChossen}.${val}`})
      //console.log(checkedKeys)
      let postPayload:PostPresentationPayload = {
          name:schemaChossen,
          schema:$vaccinationJsonLD[index].schema,
          paths:checkedKeys
        }
      console.log(postPayload)
      let res = await postNewPresentationRequest(postPayload)
      console.log(res)
      
    } else {
      alert('please select a schema')
    }

  }
</script>

<template>

  <h2>Schema builder</h2>
  <form>
    <h3>Name</h3>
    <input type="text" placeholder="my name is..."/>
    <h3>Schema</h3>
      <select bind:value={schemaChossen} on:change={() => console.log(schemaChossen)}>
        {#each $vaccinationJsonLD as item}
          <option value={item.name}>
            {item.name}
          </option>
        {/each}
      </select>
    <h3>Fields</h3>
    {#if schemaChossen !== ''}
    <h3> Schema reference: {schemaChossen}</h3>

    <ul>
      {#each Object.entries($vaccinationJsonLD[index].fields) as [key,value]}
        <li><input type=checkbox bind:checked={$vaccinationJsonLD[index].fields[key]} > {key}</li><!-- this is the html element, checked (boolean equivalent in html)-->
      {/each}
    </ul>
    {:else}
      <h2>Please select a schema</h2>
    {/if}
    
  </form>
  <button type="submit" on:click={presentationPostRequest}>
    Submit
  </button>
</template>

<style lang='postcss'>

</style>
