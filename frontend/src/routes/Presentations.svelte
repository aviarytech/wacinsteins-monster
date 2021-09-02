<style lang="postcss">
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
import ComponentList from "../lib/table-elements/ComponentList.svelte"
import Tag from "../lib/ui/Tag.svelte";
import QRcode from "../lib/QRcode.svelte";

//js imports
import { onMount } from "svelte";
//stores
import { presentations } from "../stores/presentation";
import { slideOverContent } from "../stores/ui";
;

onMount(async () => {
  const res = await getPresentations();
  console.log(res);
  if (res.length > 0) {
    presentations.set(res);
  }
})
const openPresentationRequest = (presentationId) => {
  const singleRow = $presentations.find((c) => c["@id"] === presentationId);
  slideOverContent.set({
    title: `Presentation of credentials requested from ${singleRow.definition.input_descriptors[0].name}`,
    component: PresentationDetailedView,
    presentation: singleRow,
  });
};
let rightPreviewWindowDisplayed:boolean = false

const newPresentationRequest = () => {
  slideOverContent.set({
    title: "New Presentation Request",
    component: SchemaBuilder,
    presentationSubject: [],
  });
  if (rightPreviewWindowDisplayed){
    slideOverContent.set(null)
  }
  rightPreviewWindowDisplayed = !rightPreviewWindowDisplayed
};

//BUG: the X to close the window doesn't show up.
function qrCodeDisplay(id){
  slideOverContent.set({
    title: `QR Code for ${id}`,
    component: QRcode,
    presentationSubject: [],
  });
  }

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
      headers={['ID', 'Name', 'Schema', 'Constraints', '']}
      data={$presentations.map((p) => {
        console.log(p.definition.input_descriptors[0].constraints);
        return [
          {
            component: Text,
            text: p['@id'],
          },
          {
            component: Text,
            text: p.definition.input_descriptors[0].name,
          },
          {
            component: Text,
            text: p.definition.input_descriptors[0].schema,
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
                qrCodeDisplay(p['@id']);
              }
            }
          ]
          }
        ];
      })} />
  {/if}
</template>
