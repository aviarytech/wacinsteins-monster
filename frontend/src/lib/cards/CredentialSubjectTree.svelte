<script lang="ts">
import CredentialSubjectLeaf from "./CredentialSubjectLeaf.svelte";
import { camel2Title } from "../../utils/camel2Title";

export let property: any;
</script>

{#if typeof property === "object" && Array.isArray(property)}
  {#each property as iterProp}
    {#if typeof iterProp === "string"}
      <div class="sm:col-span-2 text-md font-semibold text-gray-500">
        {iterProp}
      </div>
    {:else}
      <div
        class="ml-1 sm:col-span-2 pt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <svelte:self property="{iterProp}" />
      </div>
    {/if}
  {/each}
{:else if typeof property === "object"}
  {#each Object.entries(property) as prop}
    {#if typeof prop[1] === "object" && Array.isArray(prop[1])}
      {#each prop as iterProp}
        <svelte:self property="{iterProp}" />
      {/each}
    {:else if typeof prop[1] === "object"}
      <div
        class="border-t-2 sm:col-span-2 pt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div class="sm:col-span-2 text-md font-semibold text-gray-500">
          {camel2Title(prop[0])}
        </div>
        {#each Object.entries(prop[1]) as subProp}
          {#if typeof subProp[1] === "object"}
            <div
              class="ml-1 sm:col-span-2 pt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <svelte:self property="{subProp}" />
            </div>
          {:else}
            <CredentialSubjectLeaf title="{subProp[0]}" text="{subProp[1]}" />
          {/if}
        {/each}
      </div>
    {:else}
      <div class="sm:col-span-1">
        <dt class="text-sm font-medium text-gray-500">
          {camel2Title(prop[0])}
        </dt>
        <dd class="mt-1 text-sm text-gray-900 truncate">
          {prop[1]}
        </dd>
      </div>
    {/if}
  {/each}
{:else}
  <div class="sm:col-span-2 text-md font-semibold text-gray-500">
    {property}
  </div>
{/if}
