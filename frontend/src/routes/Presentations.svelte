
<script lang="ts">

  // api imports
  import { getPresentations } from "../api/presentationAxios";
  //component imports
  import PresentationTableData from "../lib/PresentationTableFormat.svelte"
  import SchemaBuilder from '../lib/SchemaBuilder.svelte'
  //js imports
  import { onMount } from "svelte";


  let data:string[] = []
  onMount(async() => {
        const res = await getPresentations() 
        data = res 
        console.log(data)
        if (data === null){
          console.log('api call wrong')//NOTE: shoud I raise an error?
        }
  }) 
</script>

<template>
  <SchemaBuilder />
  <!-- WARN: if statement important in case of an empty db or and error -->
  {#if data !== []}

    {#each Object.entries(data) as [i,row]}
      <PresentationTableData rowId={parseInt(i)}>
        <span slot="id">{row.id}</span>
        <span slot="name">{row.definition.input_descriptors[0].name}</span>
        <span slot="schema">{row.definition.input_descriptors[0].schema}</span>
        <span slot="constraint">{row.definition.input_descriptors[0].constraints.fields[0].paths}</span>
      </PresentationTableData>
    {/each}
  {:else}
    <h3 class="bg-yellow-500 rounded-lg max-w-prose">Nothing to show</h3>
  {/if}
</template>

<style lang="postcss">

</style>

