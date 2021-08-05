<script lang="ts">
  // api imports
  import { getCall } from "../api/presentationAxios";
  //component imports
  import PresentationTableData from "../lib/PresentationTableFormat.svelte"


//TODO: query backend for presentation
// axios/getall 

  async function apiGetCall():Promise<any>{
      let res = await getCall('https://jsonplaceholder.typicode.com/todos/1')
      console.log(res)
      return res
  }
  let displayData = false
  interface SampleApi {
      userId:number;
      id:number;
      title:string;
      completed:Boolean;
    }
  interface PresentationTableInterface {
      id:number;
      name:string;
      jobTitle:string;
      email:string;
      role:string;
    }
  export const testPresentationData: PresentationTableInterface[] = [
    {
        id:0,
        name: "Jane Cooper",
        jobTitle: "Regional Paradigm Technician",
        email:"jane.cooper@example.com",
        role: "Admin",
      },
      {
        id:1,
        name: "Cody Fisher",
        jobTitle: "Product Directives Officer",
        email:"cody.fisher@example.com",
        role: "Owner",
      },
      {
        id:2,
        name: "Bob McBob",
        jobTitle: "Customer service",
        email:"BobMcBob@example.com",
        role: "Employee",
      },
  ]
  let data:SampleApi[] = []
  $: if (displayData === true){
      (async() => {
        const res = await apiGetCall()
        data = res 
        })()
    } 
  
</script>

<template>
  <!-- garbage test data-->
  <div>
    <button on:click={() => {displayData = !displayData}}>
      click me
    </button>
  </div>

  {#if displayData === true}
    <ul>
    {#each Object.values(data) as value }
      <li>{value}</li>
    {/each}
    </ul>
  {/if}
  <!-- emd test data-->




  {#each testPresentationData as row}
    <PresentationTableData rowId={row.id}>
      <span slot="name">{row.name}</span>
    </PresentationTableData>
  {/each}





</template>

<style lang="postcss">

</style>

