<script lang="ts">
import DataTableRow from "./DataTableRow.svelte";
export let headers: string[];
export let data: object[][];
</script>

<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto ">
    <div class="py-6 align-middle inline-block min-w-full sm:px-1 lg:px-2">
      <div class="shadow border-b border-gray-200 sm:rounded-xl">
        <table class="divide-gray-200 table-auto w-full">
          <thead class="bg-gray-50">
            <tr>
              {#each headers as col}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >{col}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each data as row, i}
              <DataTableRow
                rowId="{i}"
                columns="{row}"
                callback="{row[0]['callback']}" />
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
