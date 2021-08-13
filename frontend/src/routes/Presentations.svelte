<style lang="postcss">
</style>

<script lang="ts">
// api imports
import { getPresentations } from "../api/presentationAxios";
//component imports
import SchemaBuilder from "../lib/SchemaBuilder.svelte";
import DataTable from "../lib/DataTable.svelte";
import PresentationDetailedView from "../lib/PresentationDetailedView.svelte";
//js imports
import { onMount } from "svelte";
//stores
import { presentations } from "../stores/presentation";
import { slideOverContent } from "../stores/ui";

const openPresentationRequest = (presentationId) => {
  const singleRow = $presentations.find((c) => c["@id"] === presentationId);
  slideOverContent.set({
    title: singleRow.definition.input_descriptors[0].name,
    component: PresentationDetailedView,
    presentation: singleRow,
  });
};
const newPresentationRequest = (() => {
  slideOverContent.set({
    title: 'new Presentation Request',
    component: SchemaBuilder,
    presentationSubject: [],
  });
})
onMount(async () => {
  const res = await getPresentations();
    console.log(res)
    if(res.length > 0){
        presentations.set(res)
      };
  })
</script>

<template>
  <!-- TODO: henroi fix this terrible table that I made and is self replicating.-->
  <button
    on:click={() => newPresentationRequest()}
    type="button"
    class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
    New
  </button>
  {#each $presentations as row, i}
    <DataTable
      columns="{['ID', 'Name', 'Schema', 'Constraints']}"
      rowId="{i}">
      <button on:click={() => openPresentationRequest(row['@id'])} slot="name"
        >{row.id}</button>
      <span slot="jobTitle">{row.definition.input_descriptors[0].name}</span>
      <span slot="email">{row.definition.input_descriptors[0].schema}</span>
      <span slot="role">{row.definition.input_descriptors[0].constraints.fields[0].path}</span>
      <span slot="actions"
        ><button
          on:click={() => openPresentationRequest(row['@id'])}
          type="button"
          class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          View
        </button></span>
    </DataTable>
  {/each}
</template>
