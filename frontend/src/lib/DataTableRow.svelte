<script lang="ts">
export let rowId: number;
export let columns: object[];
console.log('passed data',columns)
</script>
<!-- WARN: use svelte navigator. On click:{eventHandler} to implement--> 

<tr class="bg-white " class:bg-gray-50="{rowId % 2 !== 0}" >
  {#each columns as col}
    <td
      class={col['dataTableSpecialClass'] ? col['dataTableSpecialClass']: "cell" }>
      {#if col['clickable']}
        <a href={col['clickable']}>
          <svelte:component this="{col['component']}" {...col} />
        </a>
      {:else}
        <svelte:component this="{col['component']}" {...col} />
      {/if}
    </td>
  {/each}
</tr>


<style lang="postcss">
  .cell {
      @apply px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs;
    }
</style>
