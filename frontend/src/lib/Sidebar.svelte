<style lang="postcss">
.icon {
  @apply mr-3 flex-shrink-0 h-6 w-6;
}
</style>

<script lang="ts">
// js imports
import { Router, Link, useLocation, navigate } from "svelte-navigator";
import { Routes } from "../stores/routes";
// stores
import { mobileSidebarClose } from "../stores/ui";
import Image from "./table-elements/Image.svelte";
import Icon from "./ui/Icon.svelte";
// const location = useLocation();
// let currentLocation;
// location.subscribe((l) => {
//   currentLocation = l;
// });
let host = import.meta.env.VITE_HOST ?? "aviary.one";
</script>

<template>
  <!-- Static sidebar for desktop -->
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex flex-col flex-grow border-r border-gray-200 pt-3 pb-4 bg-white overflow-y-auto">
        <div class="flex-grow flex flex-col">
          <button
            on:click="{() => navigate('/', { replace: true })}"
            class="flex items-center flex-shrink-0 px-4 pb-5 rounded-md hover:bg-gray-50">
            <img
              class="h-8 w-auto mr-3 "
              src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc"
              alt="av1" />
            <p class="text-gray-700 font-bold hover:text-gray-900">AV1</p>
          </button>
          <div class="inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <Router>
            <nav class="flex-1 px-2 py-3 bg-white space-y-1 pr-6">
              {#each Routes as route}
                {#if route.heroIcon !== ""}
                  <Link
                    to="{route.routeUrl}"
                    id="{`${route.routeUrl}-btn`}"
                    class="text-gray-700 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-xs font-medium  rounded-md hover:text-gray-1000">
                    <Icon
                      src="{route.heroIcon}"
                      additionalClass="mr-3 flex-shrink-0 h-4 w-4 text-av1" />
                    {route.routeName}
                  </Link>
                {/if}
              {/each}
            </nav>
          </Router>
        </div>
      </div>
    </div>
  </div>
  <!-- end of sidebar -->
</template>
