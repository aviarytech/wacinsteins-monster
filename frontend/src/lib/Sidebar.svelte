<style lang="postcss">
/*
.icon {
  @apply mr-3 flex-shrink-0 h-6 w-6;
}
*/
.btn-open {
  @apply ease-in-out duration-300 opacity-100;
}
.btn-close {
  @apply ease-in-out duration-300 opacity-0;
}
.canvas-overlay-on {
  @apply transition-opacity ease-linear duration-300 opacity-100;
}
.canvas-overlay-off {
  @apply transition-opacity ease-linear duration-300 opacity-0 hidden;
}
.mbl-sidebar-menu-on {
  @apply transition ease-in-out duration-300 transform translate-x-0;
}
.mbl-sidebar-menu-off {
  @apply transition ease-in-out duration-300 transform -translate-x-full;
}
</style>

<script lang="ts">
// js imports
import { Router, Link, useLocation, navigate } from "svelte-navigator";
import { Routes } from "../stores/routes";
// stores
import { mblSidebar } from "../stores/ui";
//import Image from "./table-elements/Image.svelte";
import Icon from "./ui/Icon.svelte";
import Tag from "./ui/Tag.svelte";
//using esc to exit the slideover window
const globalEscOnKeyPress = (e) => {
  if (e.keyCode === 27) {
    mblSidebar.set(true);
  }
};
let host = import.meta.env.VITE_HOST ?? "aviary.one";
</script>

<svelte:window on:keydown="{globalEscOnKeyPress}" />

<template>
  <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
  <div
    class="fixed inset-0 flex z-40 md:hidden "
    role="dialog"
    aria-modal="true"
    class:canvas-overlay-off="{$mblSidebar}"
    class:canvas-overlay-on="{!$mblSidebar}">
    <!--
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true">
    </div>
-->
    <div
      class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-600"
      class:mbl-sidebar-menu-off="{$mblSidebar}"
      class:mbl-sidebar-menu-on="{!$mblSidebar}">
      <div class="absolute top-0 right-0 -mr-12 pt-2">
        <button
          type="button"
          on:click="{() => {
            $mblSidebar = !$mblSidebar;
          }}"
          class:btn-close="{$mblSidebar}"
          class:btn-open="{!$mblSidebar}"
          class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
          <span class="sr-only">Close sidebar</span>
          <!-- Heroicon name: outline/x -->
          <svg
            class="h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <Router>
        <Link to="" id="{`home-routeUrl-mbl-btn`}">
          <div
            class="flex-shrink-0 flex items-center px-4 hover:bg-indigo-600 rounded-lg mx-2">
            <img
              class="h-8 w-auto"
              src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc"
              alt="AV1" />
            <p
              class="text-white group flex items-center px-2 py-2 text-base font-medium rounded-md">
              AV1
            </p>
            <div class="transition-opacity animate-pulse">
              <Tag text="Demo" fontColor="text-white" bgCol="bg-av1" />
            </div>
          </div>
        </Link>
      </Router>
      <div class="mt-5 flex-1 h-0 overflow-y-auto">
        <nav class="px-2 space-y-1">
          <Router>
            <!-- Current: "bg-indigo-800 text-white", Default: "text-indigo-100 hover:bg-indigo-600" -->
            {#each Routes as route}
              {#if route.heroIcon !== ""}
                <Link
                  to="{route.routeUrl}"
                  id="{`${route.routeUrl}-mbl-btn`}"
                  class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                  on:click="{() => {
                    $mblSidebar = !$mblSidebar;
                  }}">
                  <Icon
                    src="{route.heroIcon}"
                    additionalClass="mr-3 flex-shrink-0 h-4 w-4 text-av1" />
                  {route.routeName}
                </Link>
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
    <div class="flex flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex flex-col flex-grow border-r border-gray-200 pb-4 bg-white overflow-y-auto">
        <div class="flex-grow flex flex-col">
          <button
            on:click="{() => navigate('/', { replace: true })}"
            class="flex items-center flex-shrink-0 px-4 py-4 rounded-md hover:bg-gray-50">
            <img
              class="h-8 w-auto mr-3 "
              src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc"
              alt="av1" />
            <p class="text-gray-700 font-bold hover:text-gray-900">AV1</p>
            <div class="ml-4 animate-pulse">
              <Tag text="Demo" fontColor="text-white" bgCol="bg-av1" />
            </div>
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
