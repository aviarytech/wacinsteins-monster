<script lang="ts">
import { fly } from "svelte/transition";
import { quintOut } from "svelte/easing";

import { slideOverContent, slidePreviewOverContent } from "../../stores/ui";

const closeSlideOver = () => {
  if ($slidePreviewOverContent) {
    slideOverContent.set($slidePreviewOverContent);
    slidePreviewOverContent.set(null);
  } else {
    slideOverContent.set(null);
  }
};

//using esc to exit the slideover window
const globalEscOnKeyPress = (e) => {
  if (e.keyCode === 27) {
    slideOverContent.set(null);
  }
};
</script>

<svelte:window on:keydown="{globalEscOnKeyPress}" />

<template>
  {#if $slideOverContent}
    <div
      class="fixed z-50 inset-0 bg-gray-500 bg-opacity-75"
      transition:fly="{{ duration: 500, easing: quintOut }}"
      aria-hidden="true"
      on:click="{closeSlideOver}">
    </div>

    <div
      transition:fly="{{ x: 200, duration: 500, easing: quintOut }}"
      class="fixed z-50 h-screen inset-y-0 right-0 pl-10 max-w-full flex">
      <div class="w-screen max-w-xl">
        <div
          class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
          <div class="px-4 sm:px-6">
            <div class="flex items-start justify-between">
              <h2
                class="text-lg font-medium text-gray-900"
                id="slide-over-title">
                {$slideOverContent.title ?? ""}
              </h2>
              <div class="ml-3 h-7 flex items-center">
                <button
                  class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="button"
                  on:click="{() => closeSlideOver()}">
                  <span class="sr-only">Close panel</span>
                  <!-- Heroicon name: outline/x -->
                  <img src="./assets/icons/close.svg" class="icon" alt="X" />
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 relative flex-1 px-4 sm:px-6">
            <!-- Replace with your content -->
            <div class="absolute inset-0 px-4 sm:px-6">
              <svelte:component
                this="{$slideOverContent.component}"
                {...$slideOverContent} />
            </div>
            <!-- /End replace -->
          </div>
        </div>
      </div>
    </div>
  {/if}
</template>
