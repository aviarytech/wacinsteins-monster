<script lang="ts">
import Avatar from "../Avatar.svelte";
import { simple as format } from "timeago-simple";

export let credential: any;
</script>

<div class="bg-white shadow-md rounded-xl border-2 border-blue-300">
  <div class="px-4 py-5 rounded-t-xl border-b border-gray-200 sm:px-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      {credential.name}
    </h3>
    <p class="mt-1 text-sm text-gray-500">
      {credential.description}
    </p>
  </div>
  <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
    <pre
      class="text-xs">{JSON.stringify(credential.credentialSubject, null, 2)}</pre>
    <!-- {#each Object.entries(credential.credentialSubject) as sub}
      <p class="mt-1 text-sm text-gray-500">
        {sub[0]}: {JSON.stringify(sub[1])}
      </p>
    {/each} -->
  </div>
  <div
    class="bg-gray-50 text-gray-500 flex rounded-b-xl items-center justify-between p-3">
    <div>
      <span class="font-bold">Issued</span>
      {format(credential.issuanceDate)}
    </div>
    <div>
      <span class="font-bold">Expires</span>
      {format(credential.expirationDate)}
    </div>

    <span class="font-bold"
      >Issuer <Avatar value="{credential.issuer}" left="{true}" /></span>
  </div>
</div>
