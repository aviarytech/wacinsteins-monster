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
import SubmitCredentials from "../lib/slideOverComponents/submitCredentials.svelte";
//ECMA imports
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
$: if ($slideOverContent) {
  rightPreviewWindowDisplayed = true;
} else {
  rightPreviewWindowDisplayed = false;
}
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

function submitUrl() {
  slideOverContent.set({
    title: "",
    component: SubmitCredentials,
    presentationSubject: [],
  });
  if (rightPreviewWindowDisplayed) {
    slideOverContent.set(null);
  }
  rightPreviewWindowDisplayed = !rightPreviewWindowDisplayed;
}
function qrCodeDisplay(id) {
  qrCodeIdValue.set(id[0]);
  console.log(id);
  slideOverContent.set({
    title: ``,
    component: QRcode,
    presentationSubject: [],
  });
}
</script>

<template>
  <div class="py-2">
    <Button label="New" callback="{() => newPresentationRequest()}" />
    <Button label="Submit" callback="{() => submitUrl()}" />
  </div>
  {#if $presentations}
    <DataTable
      headers="{['', 'Constraints', '']}"
      data="{$presentations.map((p) => {
        return [
          {
            component: Avatar,
            value: p['id'],
          },
          // {
          //   component: Text,
          //   text: p.definition.input_descriptors[0].name,
          // },
          // {
          //   component: Text,
          //   text: p.definition.input_descriptors[0].schema,
          // },
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
