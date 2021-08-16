<script lang="ts">
  import { camel2Title } from "../utils/camel2Title";

  export let credentialSubject: object;
  export let selected
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

{#if selected.length > 0}
  <div class="bg-gray-100 p-2 mb-2">
    <div class="sm:col-span-2 text-md font-semibold text-gray-500">
      Selected:
    </div>
    {#each selected as field}
      <div
        class="bg-blue-100 inline-flex items-center text-sm rounded mt-2 mr-1"
      >
        <span class="ml-2 mr-1 leading-relaxed truncate max-w-xs">{field}</span>
        <button
          on:click={() => {
            removeField(field);
          }}
          class="w-6 h-8 inline-block align-middle text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          <svg
            class="w-6 h-6 fill-current mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><path
              fill-rule="evenodd"
              d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
            /></svg
          >
        </button>
      </div>
    {/each}
  </div>
{/if}
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
              toggleField(`$.credentialSubject.${prop[0]}.${subProp[0]}`);
            }}
            class="sm:col-span-1 mb-3 p-2 hover:bg-blue-100 cursor-pointer"
            class:bg-blue-100={selected.indexOf(
              `$.credentialSubject.${prop[0]}.${subProp[0]}`
            ) >= 0}
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
          toggleField(`$.credentialSubject.${prop[0]}`);
        }}
        class="sm:col-span-1 p-2 mb-3 hover:bg-blue-100 cursor-pointer"
        class:bg-blue-100={selected.indexOf(`$.credentialSubject.${prop[0]}`) >=
          0}
      >
        <dt class="text-sm font-medium text-gray-500">
          {camel2Title(prop[0])}
        </dt>
        <dd class="mt-1 text-sm text-gray-900">xxx</dd>
      </div>
    {/if}
  {/each}
</dl>
