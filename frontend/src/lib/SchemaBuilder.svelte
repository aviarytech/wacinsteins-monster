<script lang='ts'>
  // interfaces
  import type { NameSchema } from '../interfaces';
  //stores
  import { vaccinationJsonLD } from '../stores/schema'
  
  let index = -1
  let schemaChossen:string = ''
  let subStoreValues:Array<any> = []

  $: if(schemaChossen !== ''){
      index = $vaccinationJsonLD.findIndex((x) => x.schema === schemaChossen)//implicit return
    }

  function displayNestedStoreField() {
    console.log('click')
    if(schemaChossen !== ''){
       
      console.log($vaccinationJsonLD[index])
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
          <option value={item.schema}>
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
  <button type="submit" on:click={displayNestedStoreField}>
    Submit
  </button>
</template>

<style lang='postcss'>

</style>
