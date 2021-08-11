<script lang="ts">
  export let rowId: number = 0;
  export let columns: string[];
</script>

<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block max-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="max-w-full divide-y divide-gray-200 table-auto">
            {#if rowId === 0}
              <thead class="bg-gray-50">
                <tr>
                  {#each columns as col}
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >{col}</th
                    >
                  {/each}
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
            {/if}
            <tbody>
              <!-- Odd row -->
              <tr class="bg-white" class:bg-gray-50={rowId % 2 !== 0}>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs"
                >
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
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"
                    >Edit</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
