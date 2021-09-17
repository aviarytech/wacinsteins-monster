<style lang="postcss">
</style>

<script lang="ts">
import { Link } from "svelte-navigator";
</script>

<template>
  <main class="bg-white py-5 mt-2 mx-auto max-w-7xl px-4 rounded-lg shadow-md">
    <div class="hero-text">
      <div class="text-center">
        <div class="font-extrabold text-gray-900 text-3xl">
          <span class="block text-gray-700">Welcome to</span>
          <span class="block text-indigo-400">Alpha Pre-Beta</span>
          <span class="block text-indigo-600">Wacinstein's Monster</span>
        </div>
      </div>
    </div>
    <div class="bg-white mx-auto max-w-7xl px-4 sm:mt-24 text-center ">
      <div class="container mx-auto w-1/2">
        <img
          src="./assets/wacinstein-who.jpeg"
          class="object-contain"
          alt="wacinstein-who?" />
      </div>
      <div class="mt-16 sm:flex sm:justify-center lg:space-between w-full">
        <div class="rounded-md shadow">
          <Link
            to="wtf"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            wtf is that?
          </Link>
        </div>
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
          <Link
            to="demo"
            class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            demo
          </Link>
        </div>
      </div>
    </div>
  </main>
</template>
