<script lang="ts">
export let value: string;
export const callback = undefined;
</script>

{#if typeof callback === "undefined"}
  <svg data-jdenticon-value="{value}" width="40" height="40">
    {value}
  </svg>
{:else}
  <button on:click="{callback}">
    <div class="rounded-full">
      <svg data-jdenticon-value="{value}" width="40" height="40">
        {value}
      </svg>
    </div>
  </button>
{/if}
