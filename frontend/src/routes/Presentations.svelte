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
import SubmitPresentationRequestSelector from "../lib/SubmitPresentationRequestSelector.svelte";
import AcceptInvitation from "../lib/slideOverComponents/acceptInvitation.svelte";
//ECMA imports
import { onMount } from "svelte";
//stores
import { presentations, qrCodeIdValue } from "../stores/presentation";
import { slideOverContent } from "../stores/ui";

$: requestsForMe = $presentations.filter((r) => r.role === "prover");
$: requestsByMe = $presentations.filter((r) => r.role === "verifier");

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
    component: AcceptInvitation,
    presentationSubject: [],
  });
  if (rightPreviewWindowDisplayed) {
    slideOverContent.set(null);
  }
  rightPreviewWindowDisplayed = !rightPreviewWindowDisplayed;
}

function openSubmitPresentation(id: string) {
  slideOverContent.set({
    title: "Submit Presentation",
    component: SubmitPresentationRequestSelector,
    presentationRequest: $presentations.find((p) => p["id"] === id),
  });
}

function qrCodeDisplay(id) {
  qrCodeIdValue.set(id[0]);
  slideOverContent.set({
    title: ``,
    component: QRcode,
    presentationSubject: [],
  });
}
function tailwingBgColorizer(value: string): string {
  let bgCol: string;
  switch (value) {
    //roles
    case "verifier":
      bgCol = "bg-purple-400";
      break;

    case "prover":
      bgCol = "bg-red-600";
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
  <div class="bg-white shadow-md rounded-sm p-5">
    <div class="flex items-center justify-end py-2">
      <Tag
        text="Prover"
        fontColor="text-white"
        bgCol="{tailwingBgColorizer('prover')}" />
      <span class="flex-grow pl-2">Presentations Requested of <b>you</b></span>
      <Button label="Accept Invitation" callback="{async () => submitUrl()}" />
    </div>
    {#if requestsForMe && requestsForMe.length > 0}
      <DataTable
        headers="{['', 'Status', 'Constraints', '']}"
        data="{requestsForMe.map((p) => {
          return [
            {
              component: Avatar,
              value: p['id'],
              dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
            },
            {
              component: Tag,
              text: p['status'],
              fontColor: 'text-white',
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
                p['role'] === 'verifier'
                  ? {
                      component: Button,
                      label: 'QR code',
                      callback: () => {
                        qrCodeDisplay([
                          p['url'],
                          p.definition.input_descriptors[0].name,
                        ]);
                      },
                    }
                  : null,
                p['role'] === 'prover'
                  ? {
                      component: Button,
                      label: 'Submit',
                      callback: () => {
                        openSubmitPresentation(p['id']);
                      },
                    }
                  : null,
              ].filter((i) => i),
            },
          ];
        })}" />
    {:else}
      <p class="pt-3 text-sm text-gray-500">No Presentation Requests</p>
    {/if}
  </div>
  <div class="bg-white shadow-md mt-10 rounded-sm p-5">
    <div class="flex items-center justify-end py-2">
      <Tag
        text="Verifier"
        fontColor="text-white"
        bgCol="{tailwingBgColorizer('verifier')}" />
      <span class="pl-2 flex-grow">Presentations Requested by <b>you</b></span>
      <Button label="New" callback="{async () => newPresentationRequest()}" />
    </div>

    {#if requestsByMe && requestsByMe.length > 0}
      <DataTable
        headers="{['', 'Status', 'Constraints', '']}"
        data="{requestsByMe.map((p) => {
          return [
            {
              component: Avatar,
              value: p['id'],
              dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
            },

            {
              component: Tag,
              text: p['status'],
              fontColor: 'text-white',
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
                p['role'] === 'verifier'
                  ? {
                      component: Button,
                      label: 'QR code',
                      callback: () => {
                        qrCodeDisplay([
                          p['url'],
                          p.definition.input_descriptors[0].name,
                        ]);
                      },
                    }
                  : null,
                p['role'] === 'prover'
                  ? {
                      component: Button,
                      label: 'Submit',
                      callback: () => {
                        openSubmitPresentation(p['id']);
                      },
                    }
                  : null,
              ].filter((i) => i),
            },
          ];
        })}" />
    {:else}
      <p class="pt-3 text-sm text-gray-500">No Presentations Requested</p>
    {/if}
  </div>
</template>
