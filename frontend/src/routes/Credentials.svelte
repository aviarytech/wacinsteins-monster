<script lang="ts">
  import CredentialDetailView from "../lib/CredentialDetailView.svelte";
  import DataTable from "../lib/DataTable.svelte";
  import { onMount } from "svelte";

  import { credentials } from "../stores/credentials";
  import { slideOverContent } from "../stores/ui";
  import { getAllCredentials } from "../api/credentials";
  import CredentialSubjectFieldSelector from "../lib/CredentialSubjectFieldSelector.svelte";
  import Text from "../lib/Text.svelte";
  import ComponentList from "../lib/ComponentList.svelte";
  import Button from "../lib/Button.svelte";

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
  <DataTable
    headers={["ID", "Issuance Date", "Issuer", "Name", ""]}
    data={$credentials.map((c) => {
      return [
        { component: Text, text: c["data"].id },
        { component: Text, text: c["data"].issuanceDate },
        { component: Text, text: c["data"].issuer.id },
        { component: Text, text: c["data"].name },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => openCredential(c["@id"]),
              label: "View",
            },
            {
              component: Button,
              callback: () => openNewPresentation(c["@id"]),
              label: "New Presentation",
            },
          ],
        },
      ];
    })}
  />
</template>
