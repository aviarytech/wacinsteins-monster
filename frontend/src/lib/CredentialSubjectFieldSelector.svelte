<script lang="ts">
import { camel2Title } from "../utils/camel2Title";

import Tag from "./ui/Tag.svelte";

export let credentialSubject: object;
export let selected: string[];
$: selected = [];

const toggleField = (fieldName: string) => {
  const index = selected.findIndex((f) => f === fieldName);
  if (index >= 0) {
    selected.splice(index, 1);
    selected = selected;
  } else {
    selected = [...selected, fieldName];
  }
};

const removeField = (fullField: string) => {
  const index = selected.findIndex((f) => f === fullField);
  if (index >= 0) {
    selected.splice(index, 1);
    selected = selected;
  }
};
</script>

<!-- INFO: DEBUG ONLY
<pre>{JSON.stringify(Object.entries(credentialSubject), null, 2)}</pre>
-->
{#if selected.length > 0}
  <div class="bg-gray-100 p-2 mb-2">
    <div class="sm:col-span-2 text-md font-semibold text-gray-500">
      Selected:
    </div>
    {#each selected as field}
      <Tag
        removeCallback="{() => {
          removeField(field);
        }}"
        text="{field}" />
    {/each}
  </div>
{/if}
<dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
  {#each Object.entries(credentialSubject) as prop}
    {#if typeof prop[1] === "object"}
      <div
        class="border-t-2 sm:col-span-2 pt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div class="sm:col-span-2 text-md font-semibold text-gray-500">
          {camel2Title(prop[0])}
        </div>
        {#each Object.entries(prop[1]) as subProp}
          {#if subProp[0] !== "type"}
            <div
              on:click="{() => {
                toggleField(`$.credentialSubject.${prop[0]}.${subProp[0]}`);
              }}"
              class="sm:col-span-1 p-2 hover:bg-blue-100 cursor-pointer"
              class:bg-blue-100="{selected.indexOf(
                `$.credentialSubject.${prop[0]}.${subProp[0]}`
              ) >= 0}">
              <dt class="sm:col-span-2 text-sm font-medium text-gray-500">
                {camel2Title(subProp[0])}
              </dt>
              <!-- <dd class="mt-1 text-sm text-gray-900">xxx</dd> -->
            </div>
          {/if}
        {/each}
      </div>
    {:else if prop[0] !== "type"}
      <div
        on:click="{() => {
          toggleField(`$.credentialSubject.${prop[0]}`);
        }}"
        class="sm:col-span-1 p-2 hover:bg-blue-100 cursor-pointer"
        class:bg-blue-100="{selected.indexOf(
          `$.credentialSubject.${prop[0]}`
        ) >= 0}">
        <dt class="text-sm font-medium text-gray-500">
          {camel2Title(prop[0])}
        </dt>
        <!-- <dd class="mt-1 text-sm text-gray-900">xxx</dd> -->
      </div>
    {/if}
  {/each}
</dl>
