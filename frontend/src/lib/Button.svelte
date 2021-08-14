<script lang="ts">
  export let label: string;
  export let callback: () => {};
</script>

<button on:click={callback} class="button">{label}</button>

<style lang="postcss">
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
