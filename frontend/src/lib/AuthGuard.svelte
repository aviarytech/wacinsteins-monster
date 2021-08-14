<script lang="ts">
  import { user } from "../stores/user";
  import { Magic } from "magic-sdk";
  import { onMount } from "svelte";

  export const MAGIC_API_KEY = import.meta.env.VITE_MAGIC as string;
  const magic = new Magic(MAGIC_API_KEY);

  const checkLoginStatus = async () => {
    // if ($user === "loading") {

    // }
    if ($user === "loading" && (await magic.user.isLoggedIn())) {
      const meta = await magic.user.getMetadata();
      user.set({ email: meta.email });
    } else {
      user.set(null);
    }
  };

  onMount(async () => {
    checkLoginStatus();
  });
</script>

<!-- <pre>{JSON.stringify($user, null, 2)}</pre> -->
{#if $user === null}
  <slot name="not_authed" />
{:else if $user}
  <slot name="authed" />
{:else}
  <slot name="loading" />
{/if}
