<script lang="ts">
  //imports
  import { getCall } from "../api/presentationAxios";


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
  let data:SampleApi[] = []
  $: if (displayData === true){
      (async() => {
        const res = await apiGetCall()
        data = res 
        })()
    } 
  
</script>

<template>
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
</template>

<style lang="postcss">

</style>

