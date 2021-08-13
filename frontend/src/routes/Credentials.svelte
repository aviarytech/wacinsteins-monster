<script lang="ts">
  import CredentialDetailView from "../lib/CredentialDetailView.svelte";
  import { onMount } from "svelte";

  import { getAllCredentials } from "../api/credentials";
  import DataTable from "../lib/DataTable.svelte";
  import { credentials } from "../stores/credentials";
  import { slideOverContent } from "../stores/ui";

  const openCredential = (credentialId) => {
    const cred = $credentials.find((c) => c["@id"] === credentialId);
    slideOverContent.set({
      title: cred["data"].name,
      component: CredentialDetailView,
      credential: cred,
    });
  };

  onMount(async () => {
    const resp = await getAllCredentials();
    if (resp.length > 0) {
      credentials.set(resp);
    }
  });
</script>

<template>
  {#each $credentials as row, i}
    <DataTable columns={["ID", "Issuance Date", "Issuer", "Name"]} rowId={i}>
      <button on:click={() => openCredential(row["@id"])} slot="name"
        >{row.data.id}</button
      >
      <span slot="jobTitle">{row.data.issuanceDate}</span>
      <span slot="email">{row.data.issuer.id}</span>
      <span slot="role">{row.data.name}</span>
      <span slot="actions"
        ><button
          on:click={() => openCredential(row["@id"])}
          type="button"
          class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View
        </button></span
      >
    </DataTable>
  {/each}
</template>

<style lang="postcss">
</style>
