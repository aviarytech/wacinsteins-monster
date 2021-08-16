<style lang="postcss">
.open {
  @apply ease-in-out duration-300 opacity-0;
}
.open2 {
  @apply transition ease-in-out duration-300 transform translate-x-0;
}

.icon {
  @apply mr-3 flex-shrink-0 h-6 w-6;
}
</style>

<script lang="ts">
// js imports
import { Router, Link, useLocation } from "svelte-navigator";
import { Routes } from "../stores/routes";
// stores
import { mobileSidebarClose } from "../stores/ui";
import Image from "./Image.svelte";
// const location = useLocation();
// let currentLocation;
// location.subscribe((l) => {
//   currentLocation = l;
// });
</script>

<template>
  <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
  <!-- HACK: some reactivity present in mobile but its wacky-->
  <div
    class="fixed inset-0 flex z-40 md:hidden"
    role="dialog"
    aria-modal="true">
    <!--
      Off-canvas menu overlay, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-75 -translate-x-full"
      class:open2="{$mobileSidebarClose}"
      aria-hidden="true">
    </div>

    <!--
      Off-canvas menu, show/hide based on off-canvas menu state.

      Entering: "transition ease-in-out duration-300 transform"
        From: "-translate-x-full"
        To: "translate-x-0"
      Leaving: "transition ease-in-out duration-300 transform"
        From: "translate-x-0"
        To: "-translate-x-full"
    -->
    <div
      class="relative flex-1 flex flex-col max-w-1/2 w-full pt-5 pb-4 bg-white opacity-100"
      class:open="{$mobileSidebarClose}">
      <!--
        Close button, show/hide based on off-canvas menu state.

        Entering: "ease-in-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in-out duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="absolute top-0 right-0 -mr-12 pt-2">
        <button
          class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          on:click="{() => {
            mobileSidebarClose.set(!$mobileSidebarClose);
          }}">
          <span class="sr-only">Close sidebar</span>
          <!-- Heroicon name: outline/x -->
          <img src="../assets/outlineX.svg" alt="heroIcon" />
        </button>
      </div>

      <div class="flex-shrink-0 flex items-center px-4">
        <img
          class="h-8 w-auto"
          src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc"
          alt="av1" />
        <a href="/" class="px-2 font-bold">aviary.one</a>
      </div>
      <div class="mt-5 flex-1 h-0 overflow-y-auto">
        <nav class="px-2 space-y-1">
          <Router>
            {#each Routes as route}
              {#if route.heroIcon !== ""}
                <div
                  class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                  <Link to="{route.routeUrl}">
                    <Image
                      src="{route.heroIcon}"
                      alt="{route.routeUrl}"
                      width="{25}"
                      height="{25}"
                      classes="inline" />
                    {route.routeName}
                  </Link>
                </div>
              {/if}
            {/each}
          </Router>
        </nav>
      </div>
    </div>

    <div class="flex-shrink-0 w-14" aria-hidden="true">
      <!-- Dummy element to force sidebar to shrink to fit close icon -->
    </div>
  </div>

  <!-- Static sidebar for desktop -->
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex flex-col flex-grow border-r border-gray-200 pt-3 pb-4 bg-white overflow-y-auto">
        <div class="flex-grow flex flex-col">
          <div class="flex items-center flex-shrink-0 px-4 pb-3">
            <img
              class="h-10 w-auto"
              src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc"
              alt="av1" />
            <a href="/" class="px-2 font-bold">aviary.one</a>
          </div>
          <div class="inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <Router>
            <nav class="flex-1 px-2 py-3 bg-white space-y-1">
              <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->
              {#each Routes as route}
                {#if route.heroIcon !== ""}
                  <!-- <div
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  > -->
                  <Link
                    to="{route.routeUrl}"
                    class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                    <img
                      src="{route.heroIcon}"
                      class="icon md:px-1"
                      alt="heroIcon" />
                    {route.routeName}
                  </Link>
                  <!-- </div> -->
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
