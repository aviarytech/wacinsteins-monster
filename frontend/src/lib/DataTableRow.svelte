<script lang="ts">
  export let rowId: number;
  export let columns: object[];
</script>

<tr class="bg-white" class:bg-gray-50={rowId % 2 !== 0}>
  {#each columns as col}
    <td
      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs"
    >
      <svelte:component this={col["component"]} {...col} />
    </td>
  {/each}
  <!--   
    <slot name="name" />
  </td>
  <td
    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"
  >
    <slot name="jobTitle" />
  </td>
  <td
    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"
  >
    <slot name="email" />
  </td>
  <td
    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs"
  >
    <slot name="role" />
  </td>
  <td
    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium truncate max-w-xs"
    ><slot name="actions" />
  </td> -->
</tr>
