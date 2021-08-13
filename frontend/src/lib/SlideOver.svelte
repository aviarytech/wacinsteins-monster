<script lang="ts">
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import { slideOverContent } from "../stores/ui";

  const closeSlideOver = () => {
    slideOverContent.set(null);
  };
</script>

<template>
  {#if $slideOverContent}
    <div
      transition:fly={{ x: 200, duration: 500, easing: quintOut }}
      class="fixed inset-y-0 right-0 pl-10 pt-16 max-w-full flex"
    >
      <div class="w-screen max-w-xl">
        <div
          class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll"
        >
          <div class="px-4 sm:px-6">
            <div class="flex items-start justify-between">
              <h2
                class="text-lg font-medium text-gray-900"
                id="slide-over-title"
              >
                {$slideOverContent.title}
              </h2>
              <div class="ml-3 h-7 flex items-center">
                <button
                  class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="button"
                  on:click={() => closeSlideOver()}
                >
                  <span class="sr-only">Close panel</span>
                  <!-- Heroicon name: outline/x -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 relative flex-1 px-4 sm:px-6">
            <!-- Replace with your content -->
            <div class="absolute inset-0 px-4 sm:px-6">
              <svelte:component
                this={$slideOverContent.component}
                {...$slideOverContent}
              />
            </div>
            <!-- /End replace -->
          </div>
        </div>
      </div>
    </div>
  {/if}
</template>
