<style global lang="postcss">
.button {
  @apply inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white;
}
.button:hover {
  @apply bg-gray-50;
}

.button:focus {
  @apply outline-none ring-2 ring-offset-2 ring-indigo-500;
}
</style>

<script lang="ts">
export let label: string = "button";
export let slotOverLabel: boolean = false;
export let callback: () => Promise<void>;
export let type = "button";
export let additionalClasses = "";
</script>

<button
  on:click="{callback}"
  class="{additionalClasses
    ? `${label
        .toLowerCase()
        .replace(/ /g, '-')}-btn ${additionalClasses} button`
    : `${label.toLowerCase().replace(/ /g, '-')}-btn button`}"
  type="{type}">
  {#if !slotOverLabel}
    {label}
  {:else}
    <slot />
  {/if}
</button>
