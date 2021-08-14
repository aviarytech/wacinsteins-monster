<script lang="ts">
  //stores
  import { Link } from "svelte-navigator";
  import { profileDropMenu } from "../stores/ui";
  import { user } from "../stores/user";
  import { sha256 } from "../utils/sha256";
</script>

<template>
  <!-- Profile dropdown -->
  <div class="ml-3 relative">
    <div>
      <button
        type="button"
        class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        id="user-menu-button"
        aria-expanded="false"
        aria-haspopup="true"
        on:click={() => {
          profileDropMenu.set(!$profileDropMenu);
        }}
      >
        <span class="sr-only">Open user menu</span>
        <img
          class="h-8 w-8 rounded-full"
          src={`http://tinygraphs.com/labs/isogrids/hexa16/${sha256(
            $user.email
          )}`}
          alt=""
        />
      </button>
    </div>

    <!--
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->
    {#if $profileDropMenu}
      <div
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95"
        class:open={$profileDropMenu}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        tabindex="-1"
      >
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <a
          class="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          tabindex="-1"
          id="user-menu-item-0">Your Profile</a
        >

        <a
          class="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          tabindex="-1"
          id="user-menu-item-1">Settings</a
        >

        <Link
          class="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          to="logout"
          id="user-menu-item-2">Sign out</Link
        >
      </div>
    {/if}
  </div>
</template>

<style lang="postcss">
  .open {
    @apply transition ease-out duration-100 transform opacity-100 scale-100;
  }
</style>
