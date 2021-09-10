<style lang="postcss">
.name {
  color: red;
}
</style>

<script lang="ts">
// api imports
import { getPresentations } from "../api/presentationAxios";
//component imports
import SchemaBuilder from "../lib/SchemaBuilder.svelte";
import DataTable from "../lib/table-elements/DataTable.svelte";
import PresentationDetailedView from "../lib/PresentationDetailedView.svelte";
import Text from "../lib/table-elements/Text.svelte";
import Button from "../lib/ui/Button.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Tag from "../lib/ui/Tag.svelte";
import QRcode from "../lib/QRcode.svelte";
import Avatar from "../lib/Avatar.svelte";
//js imports
import { onMount } from "svelte";
//stores
import { presentations, qrCodeIdValue } from "../stores/presentation";
import { slideOverContent } from "../stores/ui";
onMount(async () => {
  const res = await getPresentations();
  if (res) {
    presentations.set(res);
  }
});

const openPresentationRequest = (presentationId) => {
  const singleRow = $presentations.find((c) => c["@id"] === presentationId);
  slideOverContent.set({
    title: `Presentation Request`,
    component: PresentationDetailedView,
    presentation: singleRow,
  });
};

let rightPreviewWindowDisplayed: boolean = false;
const newPresentationRequest = () => {
  slideOverContent.set({
    title: "New Presentation Request",
    component: SchemaBuilder,
    presentationSubject: [],
  });
  if (rightPreviewWindowDisplayed) {
    slideOverContent.set(null);
  }
  rightPreviewWindowDisplayed = !rightPreviewWindowDisplayed;
};

function qrCodeDisplay(id) {
  qrCodeIdValue.set(id[0]);
  slideOverContent.set({
    title: ``,
    component: QRcode,
    presentationSubject: [],
  });
}
function tailwingBgColorizer(value: string): string | void {
  let bgCol: string;
  switch (value) {
    //roles
    case "verifier":
      bgCol = "bg-purple-400";
      break;

    case "prover":
      bgCol = "bg-pink-600";
      break;

    //status colors
    case "created":
      bgCol = "bg-gray-400";
      break;

    case "proposed":
      bgCol = "bg-yellow-600";
      break;

    case "requested":
      bgCol = "bg-yellow-600";
      break;

    case "submitted":
      bgCol = "bg-yellow-400";
      break;

    default:
      break;
  }
  return bgCol;
}

//prover - verifier
//statuses created(blue), proposed(orang), requested(oran), submitted(y)
</script>

<template>
  <div class="py-2">
    <button
      on:click="{() => newPresentationRequest()}"
      type="button"
      class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      New
    </button>
  </div>
  {#if $presentations}
    <DataTable
      headers="{['', 'Role', 'Status', 'Constraints', '']}"
      data="{$presentations.map((p) => {
        return [
          {
            component: Avatar,
            value: p['id'],
          },
          {
            component: Tag,
            text: p['role'],
            bgCol: tailwingBgColorizer(p['role']),
          },
          {
            component: Tag,
            text: p['status'],
            bgCol: tailwingBgColorizer(p['status']),
          },
          {
            component: ComponentList,
            items: p.definition.input_descriptors[0].constraints.fields.map(
              (f) => {
                return { component: Tag, text: f.path };
              }
            ),
          },
          {
            component: ComponentList,
            items: [
              {
                component: Button,
                label: 'View',
                callback: () => {
                  openPresentationRequest(p['@id']);
                },
              },
              {
                component: Button,
                label: 'QR code',
                callback: () => {
                  qrCodeDisplay([
                    p['url'],
                    p.definition.input_descriptors[0].name,
                  ]);
                },
              },
            ],
          },
        ];
      })}" />
  {/if}
</template>
