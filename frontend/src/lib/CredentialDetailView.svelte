<script lang="ts">
import { camel2Title } from "../utils/camel2Title";

export let credential: object;
const credentialTypes = credential["data"].type.filter(
  (t) => t !== "VerifiableCredential"
);
let subjects = {};
let visibleSubjectIndex = 0;
let visible = [];
$: if (Object.entries(subjects).length > 0) {
  visible = Object.values(Object.entries(subjects)[visibleSubjectIndex][1]);
}

const clicked = (e) => {
  console.log(e);
};
</script>

<template>
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
            Credential
          </button>
          <button
            on:click="{() => {
              visibleSubjectIndex = 1;
            }}"
            class:border-pink-500="{visibleSubjectIndex === 1}"
            class="text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            aria-current="page">
            Subject
          </button>
          <button
            on:click="{() => {
              visibleSubjectIndex = 2;
            }}"
            class:border-pink-500="{visibleSubjectIndex === 2}"
            class="text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            aria-current="page">
            Proof
          </button>ctx[
        </nav>
      </div>
    </div>
  </div>
  {#if visibleSubjectIndex === 0}
    <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Type</dt>
        <dd class="mt-1 text-sm text-gray-900">{credentialTypes.join(", ")}</dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">ID</dt>
        <dd class="mt-1 text-sm text-gray-900">{credential["data"].id}</dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Description</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {credential["data"].description}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Issuer</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].issuer.id}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Issuance Date</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {credential["data"].issuanceDate}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Expiration Date</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].expirationDate}
        </dd>
      </div>
    </dl>
  {:else if visibleSubjectIndex === 1}
    <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
      {#each Object.entries(credential["data"].credentialSubject) as prop}
        {#if typeof prop[1] === "object"}
          <div
            class="border-t-2  sm:col-span-2 pt-3 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-2 text-md font-semibold text-gray-500">
              {camel2Title(prop[0])}
            </div>
            {#each Object.entries(prop[1]) as subProp}
              <div class="sm:col-span-1 mt-3">
                <dt class="sm:col-span-2 text-sm font-medium text-gray-500">
                  {camel2Title(subProp[0])}
                </dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {subProp[1]}
                </dd>
              </div>
            {/each}
          </div>
        {:else}
          <div class="sm:col-span-1 mt-3">
            <dt class="text-sm font-medium text-gray-500">
              {camel2Title(prop[0])}
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {prop[1]}
            </dd>
          </div>
        {/if}
      {/each}
    </dl>
  {:else if visibleSubjectIndex === 2}
    <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Type</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].proof.type}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Verification Method</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].proof.verificationMethod}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Purpose</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].proof.proofPurpose}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Value</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].proof.proofValue}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Created Date</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {credential["data"].proof.created}
        </dd>
      </div>
    </dl>
  {/if}
</template>
