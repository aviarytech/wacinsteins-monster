<script lang="ts">
import { simple as format } from "timeago-simple";
//component
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Avatar from "../lib/ui/Avatar.svelte";
import Button from "../lib/ui/Button.svelte";
import Tag from "../lib/ui/Tag.svelte";
import CredentialDeriver from "../lib/slideOverItems/CredentialDeriver.svelte";
import CredentialCard from "../lib/cards/CredentialCard.svelte";
//stores
import { credentials } from "../stores/credentials";
import { slideOverContent } from "../stores/ui";
//ecma imports
import { getContext, onMount } from "svelte";
import { parseShc } from "../utils/shc/parsers";
//api
import { getAllCredentials } from "../api/credentials";
import CameraReader from "../lib/CameraReader.svelte";
import { scannedQRCode } from "../stores/presentation";
import { debounce } from "lodash";
const { open, close } = getContext("simple-modal"); //not really an import

$: if ($scannedQRCode) {
  const fn = debounce(async () => {
    close(CameraReader);
    const credential = await parseShc($scannedQRCode);
    slideOverContent.set({
      component: CredentialCard,
      credential: credential.payload["vc"],
    });
    scannedQRCode.set(null);
  }, 750);
  fn();
}

const openCredential = (credentialId: string) => {
  const cred = $credentials.find((c) => c["id"] === credentialId);
  slideOverContent.set({
    title: cred["verifiableCredential"].name,
    component: CredentialCard,
    credential: cred["verifiableCredential"],
  });
};

const openDeriveCredential = (credentialId: string) => {
  const cred = $credentials.find((c) => c["id"] === credentialId);
  slideOverContent.set({
    title: `Derive Credential`,
    component: CredentialDeriver,
    credentialId: cred["id"],
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
  <div class="bg-white shadow-md rounded-sm p-5">
    <div class="flex items-center justify-start py-2">
      <Tag text="Holder" fontColor="text-white" bgCol="bg-green-400" />
      <span class="pl-2 pr-6 flex-grow-1">Your Credentials</span>
      <div class="button-row">
        <Button
          slotOverLabel="{true}"
          callback="{async () => {
            open(CameraReader);
          }}">Import</Button>
      </div>
    </div>
    {#if $credentials && $credentials.length > 0}
      <DataTable
        headers="{['', 'Name', 'Issuer', 'Issued', '']}"
        data="{$credentials.map((c) => {
          return [
            {
              component: Avatar,
              value: c['verifiableCredential'].id,
              dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
            },
            { component: Text, text: c['verifiableCredential'].name ?? '' },
            {
              component: Text,
              text: c['verifiableCredential'].issuer.id
                ? `${c['verifiableCredential'].issuer.id.slice(0, 16)}...`
                : `${c['verifiableCredential'].issuer.slice(0, 16)}...`,
            },
            {
              component: Text,
              text: format(c['verifiableCredential'].issuanceDate),
            },
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
    {:else}
      <p class="pt-3 text-sm text-gray-500">No Credentials 😞</p>
    {/if}
  </div>
</template>
