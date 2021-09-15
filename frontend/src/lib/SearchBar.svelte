<style global lang="postcss">
</style>

<script lant="ts">
import Icon from "./Icon.svelte";
import Roles from "./Roles.svelte";
</script>

<template>
  <div class="w-full flex ml-1 justify-end items-center">
    <form class="flex-grow" action="#" method="GET">
      <label for="search-field" class="sr-only">Search</label>
      <div class="relative w-full text-gray-400 focus-within:text-gray-600">
        <div
          class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
          <!-- Heroicon name: outline/document search -->
          <Icon />
        </div>
        <input
          id="search-field"
          class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
          placeholder="Search"
          type="search"
          name="search" />
      </div>
    </form>
    <Roles />
  </div>
</template>
