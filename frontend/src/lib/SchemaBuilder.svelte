<script lang='ts'>
  import type { SchemaSelect } from '../interfaces';


  import { vaccinationCertificateStore,vaccineRecipientStore, vaccineStore } from '../stores/schema'
  //
  let availableSchemas:SchemaSelect[] = [
   {id:0,schemaStore:vaccineRecipientStore,schemaInterface:"VaccineRecipient"},
   {id:1,schemaStore:vaccinationCertificateStore,schemaInterface:"VaccinationCertificateInterface"},
   {id:2,schemaStore:vaccineStore,schemaInterface:"VaccineRecipientInterface"}
  ]
  let schemaChossen:any
  let tmp:any //don't know what to do/name this var yet
  let schemaBuild:any //need a type (is the return value of all this)
  //TODO: access the store when its not undefined and make it so that once a field has been added it can't be added again
  $: if (schemaChossen !== undefined){
      schemaChossen.schemaStore.subscribe((fields) =>{
        tmp = fields
      })
    }
</script>

<template>

  <h2>Schema builder</h2>
  <form>
    <h3>Name</h3>
    <input type="text" placeholder="my name is..."/>
    <h3>Schema</h3>
      <select bind:value={schemaChossen} on:change={() => console.log(schemaChossen)}>
        {#each availableSchemas as availableSchema}
          <option value={availableSchema}>
            {availableSchema.schemaInterface}
          </option>
        {/each}
      </select>
    <h3>Fields</h3>
    
    {#if schemaChossen !== undefined}
      {schemaChossen.schemaStore}
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
