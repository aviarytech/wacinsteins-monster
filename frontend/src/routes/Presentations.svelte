<script lang="ts" module>
  // import { onMount } from "svelte";

  // import { useLocation } from "svelte-navigator";

  // api imports
  import { getCall } from "../api/presentationAxios";
  //component imports
  import PresentationTableData from "../lib/PresentationTableFormat.svelte";

  interface PresentationTableInterface {
    id: number;
    name: string;
    jobTitle: string;
    email: string;
    role: string;
  }
  export const testPresentationData: PresentationTableInterface[] = [
    {
      id: 0,
      name: "Jane Cooper",
      jobTitle: "Regional Paradigm Technician",
      email: "jane.cooper@example.com",
      role: "Admin",
    },
    {
      id: 1,
      name: "Cody Fisher",
      jobTitle: "Product Directives Officer",
      email: "cody.fisher@example.com",
      role: "Owner",
    },
    {
      id: 2,
      name: "Bob McBob",
      jobTitle: "Customer service",
      email: "BobMcBob@example.com",
      role: "Employee",
    },
  ];

  // const location = useLocation();
  // $: console.log($location);

  const mockendUrl = "https://mockend.com/aviarytech/wacinsteins-monster/users";
  async function apiGetCall(): Promise<any> {
    let res = await getCall(mockendUrl);
    console.log(res);
    return res;
  }
  let displayData = false;
  let data: PresentationTableInterface[] = [];
  $: if (displayData === false) {
    (async () => {
      const res = await apiGetCall();
      data = res;
      displayData = !displayData;
    })();
  }
  //  <div>
  //   <button on:click={() => {displayData = !displayData}}>
  //     display data
  //   </button>
  // </div>
</script>

<template>
  <h2>{data.length} presentation requests</h2>
  {#each data as row}
    <PresentationTableData rowId={row.id}>
      <span slot="name">{row.name}</span>
      <span slot="jobTitle">{row.jobTitle}</span>
      <span slot="email">{row.email}</span>
      <span slot="role">{row.role}</span>
    </PresentationTableData>
  {/each}
</template>

<style lang="postcss">
</style>
