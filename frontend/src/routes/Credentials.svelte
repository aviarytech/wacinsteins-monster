<script lang="ts">
//component
import CredentialDetailView from "../lib/CredentialDetailView.svelte";
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Avatar from "../lib/Avatar.svelte";
import Button from "../lib/ui/Button.svelte";
//stores
import { credentials } from "../stores/credentials";
import { slideOverContent } from "../stores/ui";
import { onMount } from "svelte";
import { getAllCredentials } from "../api/credentials";
import CredentialDeriver from "../lib/CredentialDeriver.svelte";

const openCredential = (credentialId: string) => {
  const cred = $credentials.find((c) => c["id"] === credentialId);
  slideOverContent.set({
    title: cred["verifiableCredential"].name,
    component: CredentialDetailView,
    credential: cred,
  });
};

const openDeriveCredential = (credentialId: string) => {
  const cred = $credentials.find((c) => c["id"] === credentialId);
  slideOverContent.set({
    title: `Derive Credential`,
    component: CredentialDeriver,
    verifiableCredential: cred["verifiableCredential"],
  });
};

onMount(async () => {
  const resp = await getAllCredentials();
  if (resp) {
    credentials.set(resp);
  }
});
</script>

<template>
  <DataTable
    headers="{['', 'Name', 'Issuer', 'Issuance Date', 'Derivations', '']}"
    data="{$credentials.map((c) => {
      return [
        { component: Avatar, value: c['verifiableCredential'].id },
        { component: Text, text: c['verifiableCredential'].name },
        { component: Text, text: c['verifiableCredential'].issuer.id },
        { component: Text, text: c['verifiableCredential'].issuanceDate },
        { component: Text, text: c['derivedCredentials'].length },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => openCredential(c['id']),
              label: 'View',
            },
            {
              component: Button,
              callback: () => {
                openDeriveCredential(c['id']);
              },
              label: 'Derive Credential',
            },
          ],
        },
      ];
    })}" />
</template>
