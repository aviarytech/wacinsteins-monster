<script lang="ts">
//components
import QRcode from "./QRcode.svelte";
import ComponentList from "../table-elements/ComponentList.svelte";
import Tag from "../ui/Tag.svelte";
import Button from "../ui/Button.svelte";
import CredentialCard from "../cards/CredentialCard.svelte";
import SubmitPresentationRequestSelector from "../SubmitPresentationRequestSelector.svelte";
//stores
import { presentations } from "../../stores/presentation";
import { slideOverContent } from "../../stores/ui";
//ECMA imports
import { onMount } from "svelte";
import {
  acceptProposalSubmit,
  getPresentations,
} from "../../api/presentationAxios";
//exports
export let presentation;

let subjects = {};
let visibleSubjectIndex = 0;
let visible = [];
$: if (Object.entries(subjects).length > 0) {
  visible = Object.values(Object.entries(subjects)[visibleSubjectIndex][1]);
}
onMount(() => {
  if (presentation.status === "submitted") {
    visibleSubjectIndex = 1;
  }
});
const openSubmitter = () => {
  slideOverContent.set({
    title: "Submit Presentation",
    component: SubmitPresentationRequestSelector,
    presentationRequest: presentation,
  });
};

async function acceptProposal() {
  const resp = await acceptProposalSubmit(presentation.id);
  const pres = await getPresentations();
  if (pres) {
    presentations.set(pres);
  }
  slideOverContent.set(null);
}
</script>

<template>
  <div id="presentation-detail-view">
    <div class="mt-6 sm:mt-2 2xl:mt-5">
      <div class="border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              on:click="{() => {
                visibleSubjectIndex = 0;
              }}"
              class:border-pink-500="{visibleSubjectIndex === 0}"
              class="text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              aria-current="page">
              Definition
            </button>
            {#if presentation.status === "created" && presentation.role === "verifier"}
              <button
                on:click="{() => {
                  slideOverContent.set({
                    title: ``,
                    component: QRcode,
                    value: presentation.url,
                  });
                }}"
                class:border-pink-500="{visibleSubjectIndex === 1}"
                class="text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                aria-current="page">
                QR
              </button>
            {/if}
            {#if presentation.status === "submitted"}
              <button
                on:click="{() => {
                  visibleSubjectIndex = 1;
                }}"
                class:border-pink-500="{visibleSubjectIndex === 1}"
                class="text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                aria-current="page">
                Presentation
              </button>
            {/if}
          </nav>
        </div>
      </div>
    </div>

    <!-- <pre>{JSON.stringify(presentation,null,2)}</pre> -->

    {#if visibleSubjectIndex === 0}
      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div class="sm:col-span-1 mt-3 ">
          <dt class="text-sm font-medium text-gray-500">ID</dt>
          <dd class="mt-1 text-sm text-gray-900 truncate max-w-xs">
            {presentation.id}
          </dd>
        </div>
        <div class="sm:col-span-1 mt-3">
          <dt class="text-sm font-medium text-gray-500">Name</dt>
          <dd class="mt-1 text-sm text-gray-900 truncate max-w-xs">
            {presentation.definition
              ? presentation.definition.input_descriptors[0].name
              : ""}
          </dd>
        </div>
        <div class="sm:col-span-1 mt-3">
          <dt class="text-sm font-medium text-gray-500">Schema</dt>
          <dd class="mt-1 text-sm text-gray-900 truncate max-w-xs">
            {presentation.definition
              ? presentation.definition.input_descriptors[0].schema
              : ""}
          </dd>
        </div>
        <div class="sm:col-span-1 mt-3">
          <dt class="text-sm font-medium text-gray-500">Constraints</dt>
          <dd class="mt-1 text-sm text-gray-900 max-w-xs">
            <ComponentList
              items="{presentation.definition
                ? presentation.definition.input_descriptors[0].constraints.fields.map(
                    (f) => {
                      return { component: Tag, text: f.path };
                    }
                  )
                : []}" />
          </dd>
        </div>
      </dl>
    {:else if visibleSubjectIndex === 1}
      {#each presentation.presentations as pres}
        {#each pres["verifiableCredential"] as vc}
          <div class="pt-2">
            <CredentialCard credential="{vc}" />
          </div>
        {/each}
      {/each}
    {/if}
    {#if presentation.role === "prover" && presentation.status === "requested"}
      <div class="mt-4">
        <Button
          callback="{async () => {
            openSubmitter();
          }}"
          label="Submit" />
      </div>
    {:else if presentation.role === "verifier" && presentation.status === "proposed"}
      <div class="mt-4">
        <Button
          callback="{async () => {
            acceptProposal();
          }}"
          label="Accept" />
      </div>
    {/if}
  </div>
</template>
