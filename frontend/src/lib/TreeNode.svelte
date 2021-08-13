<script lang="ts">
import LeafNode from "./LeafNode.svelte";
export let expanded = false;
export let key: string;
export let value: string | object;

const toggle = () => {
  expanded = !expanded;
};
</script>

<span class:expanded on:click="{toggle}">{key}</span>

{#if expanded}
  {#if typeof value === "string"}
    <LeafNode key="{key}" value="{value}" />
  {:else}
    {#each Object.entries(value) as [key, value]}
      <svelte:self key="{key}" value="{value}" />
    {/each}
  {/if}
{/if}
