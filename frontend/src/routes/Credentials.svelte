<script lang="ts">
//component
import CredentialDetailView from "../lib/CredentialDetailView.svelte";
import DataTable from "../lib/table-elements/DataTable.svelte";
import CredentialSubjectFieldSelector from "../lib/CredentialSubjectFieldSelector.svelte";
import Text from "../lib/table-elements/Text.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Avatar from "../lib/Avatar.svelte";
import Button from "../lib/ui/Button.svelte";
//stores
import { credentials } from "../stores/credentials";
import { slideOverContent } from "../stores/ui";
import { onMount } from "svelte";
import { getAllCredentials } from "../api/credentials";

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
  await getAllCredentials();
});
</script>

<template>
  <DataTable
    headers="{['', 'Name', 'Issuer', 'Issuance Date', '']}"
    data="{$credentials.map((c) => {
      return [
        { component: Avatar, value: c['data'].id },
        { component: Text, text: c['data'].name },
        { component: Text, text: c['data'].issuer.id },
        { component: Text, text: c['data'].issuanceDate },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => openCredential(c['@id']),
              label: 'View',
            },
            {
              component: Button,
              callback: () => openNewPresentation(c['@id']),
              label: 'New Presentation',
            },
          ],
        },
      ];
    })}" />
</template>
