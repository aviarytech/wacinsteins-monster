<style lang="postcss">
.cell {
  @apply px-6 py-4 truncate text-sm font-medium text-gray-900 max-w-xs;
}
</style>

<script lang="ts">
export let rowId: number;
export let columns: object[];
export let callback: () => {};
</script>

<!-- WARN: use svelte navigator. On click:{eventHandler} to implement-->
{#if callback}
  <tr
    class="bg-white hover:bg-blue-50 cursor-pointer"
    class:bg-gray-50="{rowId % 2 !== 0}"
    on:click="{callback}">
    {#each columns as col}
      <td
        class="{col['dataTableSpecialClass']
          ? col['dataTableSpecialClass']
          : 'cell'}">
        <svelte:component this="{col['component']}" {...col} />
      </td>
    {/each}
  </tr>
{:else}
  <tr class="bg-white" class:bg-gray-50="{rowId % 2 !== 0}">
    {#each columns as col}
      <td
        class="{col['dataTableSpecialClass']
          ? col['dataTableSpecialClass']
          : 'cell'}">
        <svelte:component this="{col['component']}" {...col} />
      </td>
    {/each}
  </tr>
{/if}
