<script lang="ts">
import Avatar from "../ui/Avatar.svelte";
import CredentialSubjectTree from "./CredentialSubjectTree.svelte";
import { simple as format } from "timeago-simple";
import { verifyVC } from "../../api/verifier";
import VerificationBadge from "../VerificationBadge.svelte";

export let displayVerification: boolean = true;
export let credential: any;
$: verified = (async () => {
  return await verifyVC(credential);
})();
</script>

<div class="bg-white shadow-md rounded-xl border-2 border-blue-200">
  <div class="flex items-stretch justify-between">
    <div
      class="p-3 flex-none border-b border-r rounded-tl-xl bg-gray-50 text-center flex items-center">
      <span class="text-gray-500"
        >Issuer <Avatar value="{credential.issuer}" right="{true}" /></span>
    </div>
    <div
      class="px-4 py-5 rounded-t-xl border-b border-gray-200 sm:px-6 flex-grow bg-gray-50">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        {credential.name ?? ""}
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        {credential.description ?? ""}
      </p>
    </div>
    <div
      class=" rounded-t-xl border-b border-gray-200 sm:px-6 bg-gray-50  flex items-center">
      {#if displayVerification}
        {#await verified}
          ...
        {:then v}
          <VerificationBadge verified="{v}" />
        {/await}
      {/if}
    </div>
  </div>
  <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
    <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
      <CredentialSubjectTree property="{credential.credentialSubject}" />
    </dl>
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
  </div>
</div>
