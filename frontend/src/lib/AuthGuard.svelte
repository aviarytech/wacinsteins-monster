<script lang="ts">
import { user } from "../stores/user";
</script>

{#if $user}
  <slot name="authed">
    <em>authed</em>
  </slot>
{:else}
  <slot name="not_authed">
    <em>not_authed</em>
  </slot>
{/if}
