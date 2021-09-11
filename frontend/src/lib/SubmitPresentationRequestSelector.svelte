<script lang="ts">
import { applyFrame } from "../utils/applyFrame";

import { deriveCredential } from "../api/credentials";

import { credentials } from "../stores/credentials";
import Tag from "./ui/Tag.svelte";
import CredentialCard from "./cards/CredentialCard.svelte";

export let presentation: any;
let selectedCredentialId: any;
$: derivedCredential = (async () => {
  const selectedCredential = $credentials.find(
    (c) => c.id === selectedCredentialId
  );
  if (selectedCredential) {
    return await applyFrame(
      selectedCredential.verifiableCredential,
      presentation.definition.frame
    );
  }
  return null;
})();
</script>

<form class="space-y-8 divide-y divide-gray-200">
  <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
    <div>
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Selective Disclosure
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          The information selected here will be submitted to <b
            >{presentation.requester}</b> so be careful what you share.
        </p>
      </div>
      <div
        class="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          for="descriptors"
          class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
          Required Information
        </label>
        <div class="mt-1 sm:mt-0 sm:col-span-2">
          {#each presentation.definition.input_descriptors[0].constraints.fields as field}
            <Tag text="{field['path']}" />
          {/each}
        </div>
      </div>
      <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
        <div
          class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            for="credential"
            class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
            Credential
          </label>
          <div class="mt-1 sm:mt-0 sm:col-span-2">
            <select
              id="credential"
              name="credential"
              autocomplete="credential"
              bind:value="{selectedCredentialId}"
              class="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
              <option value="">Select a valid credential</option>
              {#each $credentials as cred}
                <option value="{cred.id}">{cred.id}</option>
              {/each}
            </select>
          </div>
        </div>
        {#await derivedCredential}
          <h1>Deriving...</h1>
        {:then derivedDocument}
          {#if derivedDocument}
            <CredentialCard credential="{derivedDocument}" />
          {/if}
          <!-- <pre>{JSON.stringify(derivedDocument, null, 2)}</pre> -->

          <!-- <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
            <label for="photo" class="block text-sm font-medium text-gray-700">
              {derivedDocument}
            </label>
            <div class="mt-1 sm:mt-0 sm:col-span-2">
              <div class="flex items-center">
                <span
                  class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    class="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </span>
                <button
                  type="button"
                  class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              for="cover-photo"
              class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Cover photo
            </label>
            <div class="mt-1 sm:mt-0 sm:col-span-2">
              <div
                class="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        class="sr-only" />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div> -->
        {/await}
      </div>
    </div>
  </div>
</form>
