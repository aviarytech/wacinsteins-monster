<script lang="ts">
import Icon from "./Icon.svelte";

export let verified;
</script>

{#if verified}
  <Icon
    src="./assets/icons/checkmark-outline.svg"
    color="text-green-400"
    width="{30}" />
{:else}
  <Icon
    src="/assets/icons/close-outline.svg"
    color="text-red-400"
    width="{30}" />
{/if}
