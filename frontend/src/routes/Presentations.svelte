
<script lang="ts">
  // api imports
  import { getPresentations } from "../api/presentationAxios";
  //component imports
  import PresentationTableData from "../lib/PresentationTableFormat.svelte"
  import SchemaBuilder from '../lib/SchemaBuilder.svelte'
  async function apiGetCall():Promise<any>{
    let res = await getPresentations()
    console.log(res)
    return res
  }

  let displayData = false
  //BUG: we have some issue with the get call hence why everything breaks down. because the first thing this page
  //BUG: need to talk with the boss regarding the backend changes
  let data:string[] = []
  $: if (displayData === false){
      (async() => {
        const res = await apiGetCall()
        data = res 
        console.log(data)
        if (data === null){
          console.log('api call wrong')//NOTE: shoud I raise an error?
        } else {
          displayData = !displayData

        }
        })()
    } 
</script>

<template>
  <SchemaBuilder />
  <!-- WARN: if statement important in case of an empty db or and error -->
  {#if data !== null}

    {#each Object.entries(data) as [i,row]}
      <PresentationTableData rowId={parseInt(i)}>
        <span slot="id">{row.id}</span>
        <span slot="name">{row.request.definition.input_descriptors[0].name}</span>
        <span slot="schema">{row.request.definition.input_descriptors[0].schema}</span>
        <span slot="constraint">{row.request.definition.input_descriptors[0].constraints.fields[0].paths}</span>
      </PresentationTableData>
    {/each}
  {:else}
    <h3 class="bg-yellow-500 rounded-lg max-w-prose">Nothing to show</h3>
  {/if}
</template>

<style lang="postcss">

</style>

