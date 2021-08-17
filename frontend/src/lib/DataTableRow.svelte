<script lang="ts">
export let rowId: number;
export let columns: object[];
</script>

<tr class="bg-white " class:bg-gray-50="{rowId % 2 !== 0}">
  {#each columns as col}
    <!-- NOTE: to rewrite using a class ternary-->
      <td
        class={col['dataTableSpecialClass'] ? col['dataTableSpecialClass']: "cell" }>
        <svelte:component this="{col['component']}" {...col} />
      </td>

  {/each}
</tr>

<style lang="postcss">
  .cell {
      @apply px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs;
    }
</style>
