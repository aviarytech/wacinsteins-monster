<script lang="ts">
  export let rowId: number = 0;
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full">
        <div class="shadow overflow-hidden border-b border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <!--WARN: MOCKEND API TEST GENERATED INDEX STARTS AT INDEX 1-->
            {#if rowId === 1}
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-md"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th scope="col" class="relative px-6 py-3 rounded-tr-md">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
            {/if}
            <tbody>
              <!-- Odd row -->
              <tr class="bg-white" class:bg-gray-50={rowId % 2 !== 0}>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  <slot name="name" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <slot name="jobTitle" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <slot name="email" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <slot name="role" />
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"
                    >Edit</a
                  >
                </td>
              </tr>

              <!-- Even row -->
              <tr class="bg-gray-50" />

              <!-- More people... -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
