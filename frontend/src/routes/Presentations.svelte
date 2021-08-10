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
  let data:Array<string> = []
  $: if (displayData === false){
      (async() => {
        const res = await apiGetCall()
        data = res 
        displayData = !displayData
        })()
    } 

</script>

<template>
  <SchemaBuilder />

  {#each Object.entries(data) as [i,row]}
    <PresentationTableData rowId={parseInt(i)}>
      <span slot="id">{row.id}</span>
      <span slot="name">{row.request.definition.input_descriptors[0].name}</span>
      <span slot="schema">{row.request.definition.input_descriptors[0].schema}</span>
      <span slot="constraint">{row.request.definition.input_descriptors[0].constraints.fields[0].paths}</span>
    </PresentationTableData>
  {/each}
  





</template>

<style lang="postcss">

</style>

