<script lang="ts">
  import { getAllCredentials } from "../api/credentials";
  import DataTable from "../lib/DataTable.svelte";
  import type { Credential } from "../interfaces";

  let data: Credential[] = [];
  let fetchData = true;

  $: if (fetchData)
    (async () => {
      data = await getAllCredentials();
      fetchData = !fetchData;
      console.log(data);
    })();
</script>

<template>
  {#each data as row, i}
    <DataTable columns={['ID', 'Issuance Date', 'Issuer', 'Name']} rowId={i}>
      <span slot="name">{row.data.id}</span>
      <span slot="jobTitle">{row.data.issuanceDate}</span>
      <span slot="email">{row.data.issuer.id}</span>
      <span slot="role">{row.data.name}</span>
    </DataTable>
  {/each}
</template>

<style lang="postcss">
</style>
