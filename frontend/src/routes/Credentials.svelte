<style lang="postcss">
.button {
  @apply inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white;
}
.button:hover {
  @apply bg-gray-50;
}

.button:focus {
  @apply outline-none ring-2 ring-offset-2 ring-indigo-500;
}
</style>

<script lang="ts">
import CredentialDetailView from "../lib/CredentialDetailView.svelte";
import DataTable from "../lib/DataTable.svelte";
import { onMount } from "svelte";

import { credentials } from "../stores/credentials";
import { slideOverContent } from "../stores/ui";
import { getAllCredentials } from "../api/credentials";
import CredentialSubjectFieldSelector from "../lib/CredentialSubjectFieldSelector.svelte";

const openCredential = (credentialId: string) => {
  const cred = $credentials.find((c) => c["@id"] === credentialId);
  slideOverContent.set({
    title: cred["data"].name,
    component: CredentialDetailView,
    credential: cred,
  });
};

const openNewPresentation = (credentialId: string) => {
  const cred = $credentials.find((c) => c["@id"] === credentialId);
  slideOverContent.set({
    title: `New Presentation Request`,
    component: CredentialSubjectFieldSelector,
    credentialSubject: cred["data"].credentialSubject,
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
    <DataTable
      columns={['ID', 'Issuance Date', 'Issuer', 'Name']}
      rowId="{i}">
      <button on:click={() => openCredential(row['@id'])} slot="name"
        >{row.data.id}</button>

      <span slot="jobTitle">{row.data.issuanceDate}</span>
      <span slot="email">{row.data.issuer.id}</span>
      <span slot="role">{row.data.name}</span>
      <span slot="actions"
        ><button
          on:click="{() => openCredential(row['@id'])}"
          type="button"
          class="button">
          View
        </button><button
          on:click="{() => openNewPresentation(row['@id'])}"
          class="button">New Presentation</button>
      </span>
    </DataTable>
  {/each}
</template>
