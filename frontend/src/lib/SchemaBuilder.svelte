<script lang='ts'>
  // interfaces
  import type { NameSchema } from '../interfaces';
  //stores
  import { vaccinationJsonLD } from '../stores/schema'
  
  let index = -1
  let schemaChossen:any // assing a type
  $: if(schemaChossen !== ''){
      index = $vaccinationJsonLD.findIndex((x) => x.schema === schemaChossen)//implicit return
      console.log(index)
    }
  $: if(index !== -1){
      console.log('index',index);
      let storeValue:Array<any> = []
      $vaccinationJsonLD[index].store.subscribe(value => {
        storeValue.push(value)})

      console.log(storeValue)
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
      {schemaChossen}
    {/if}

    <!--
      <select bind:value={schemaBuild} on:change={() => console.log(schemaBuild)}>
        {#each tmp as schemaField}
          <option value={schemaField}>
            {schemaField}
          </option>
        {/each}
      </select>
    -->
    <button>
        <img
          src="../assets/outlinePlusCircle.svg"
          alt="heroIcon"
          class="icon"
        />
    </button>
    <button type="submit">
      Submit
    </button>
  </form>

</template>

<style lang='postcss'>

</style>
