<script lang="ts">
export let items;
</script>

{#each items as { component, ...item }}
  <svelte:component this="{component}" {...item} />
{/each}
