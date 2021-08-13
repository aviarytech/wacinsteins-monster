<script lang="ts">
  import { camel2Title } from "../utils/camel2Title";

  export let credentialSubject: object;

  $: selected = [];

  const toggleField = (fieldName: string) => {
    const fullField = `$.credentialSubject.${fieldName}`;
    const index = selected.findIndex((f) => f === fullField);
    if (index >= 0) {
      selected.splice(index, 1);
      selected = selected;
    } else {
      selected = [...selected, fullField];
    }
  };
</script>

<ul>
  {#each selected as field}
    <li>{field}</li>
  {/each}
</ul>
<dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
  {#each Object.entries(credentialSubject) as prop}
    {#if typeof prop[1] === "object"}
      <div
        class="border-t-2 sm:col-span-2 pt-3 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2"
      >
        <div class="sm:col-span-2 text-md font-semibold text-gray-500">
          {camel2Title(prop[0])}
        </div>
        {#each Object.entries(prop[1]) as subProp}
          <div
            on:click={() => {
              toggleField(`${prop[0]}.${subProp[0]}`);
            }}
            class="sm:col-span-1 mb-3 p-2 hover:bg-blue-100 cursor-pointer"
          >
            <dt class="sm:col-span-2 text-sm font-medium text-gray-500">
              {camel2Title(subProp[0])}
            </dt>
            <dd class="mt-1 text-sm text-gray-900">xxx</dd>
          </div>
        {/each}
      </div>
    {:else}
      <div
        on:click={() => {
          toggleField(prop[0]);
        }}
        class="sm:col-span-1 p-2 mb-3 hover:bg-blue-100 cursor-pointer"
      >
        <dt class="text-sm font-medium text-gray-500">
          {camel2Title(prop[0])}
        </dt>
        <dd class="mt-1 text-sm text-gray-900">xxx</dd>
      </div>
    {/if}
  {/each}
</dl>
