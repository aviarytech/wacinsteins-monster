<script lang="ts">
  import { user } from "../stores/user";
  import { Magic } from "magic-sdk";
  import { onMount } from "svelte";

  // export const MAGIC_API_KEY = import.meta.env.VITE_MAGIC as string;
  // const magic = new Magic(MAGIC_API_KEY);

  // const checkLoginStatus = async () => {
  //   if ($user) {
  //     return;
  //   }
  //   if (await magic.user.isLoggedIn()) {
  //     const meta = await magic.user.getMetadata();
  //     user.set({ email: meta.email });
  //   } else {
  //     user.set(null);
  //   }
  // };

  // onMount(async () => {
  //   checkLoginStatus();
  // });
</script>

<!-- <pre>{JSON.stringify($user, null, 2)}</pre> -->

{#if $user}
  <slot name="authed">
    <em>authed</em>
  </slot>
{:else}
  <slot name="not_authed">
    <em>not_authed</em>
  </slot>
{/if}
<!-- <slot><h1>test</h1></slot> -->
