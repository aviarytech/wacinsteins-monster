<script lang="ts">
import DataTableRow from "./DataTableRow.svelte";
export let headers: string[];
export let data: object[][];
</script>

<div class="w-full">
  <!-- <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> -->
  <!-- <div class="py-2 align-middle inline-block sm:px-6 lg:px-8"> -->
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
          <DataTableRow rowId="{i}" columns="{row}" callback={row[0]['callback']}/>
        {/each}
      </tbody>
    </table>
  </div>
</div>
