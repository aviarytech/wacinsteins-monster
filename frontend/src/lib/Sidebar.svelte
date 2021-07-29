<script lang="ts">
  import { Router, Link } from "svelte-navigator";
  import { Routes } from "../stores/routes"
</script>

<template>
<!-- Static sidebar for desktop -->
  <div class="hidden md:flex md:flex-shrink-0">
    <div class="flex flex-col w-64">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col flex-grow border-r border-gray-200 pt-3 pb-4 bg-white overflow-y-auto">

        <div class="flex-grow flex flex-col">
          
          <div class="flex items-center flex-shrink-0 px-4 pb-3">
            <img class="h-10 w-auto" src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc" alt="av1">
            <a href="#" class="px-2 font-bold">aviary.one</a>
          </div>
          <div class="inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <Router>
          <nav class="flex-1 px-2 py-3 bg-white space-y-1">
            <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" -->
            <a href="#" class="bg-gray-100 text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <!--
                Heroicon name: outline/bookmark-alt

                Current: "text-gray-500", Default: "text-gray-400 group-hover:text-gray-500"
              -->
              <img src="../assets/outlineBookmarkAlt.svg" alt="outline/bookmarkAlt"/>
              Credentials
            </a>

            <a href="#" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <!-- Heroicon name: outline/Document-report -->
              
              <img src="../assets/outlineDocumentReport.svg" alt="outline/Document-report"/>
              Presentations
            </a>

            <a href="#" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <!-- Heroicon name: outline/chat-alt-2 -->

              <img src="../assets/outlineChatAlt2.svg" alt="outline/chat-alt-2"/>
              Messages
            </a>

            <a href="#" class="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <!-- Heroicon name: outline/user -->

              <img src="../assets/outlineUser.svg" alt="outline/user"/>
              Connections
            </a>

          </nav>
          </Router>
        </div>
      </div>
    </div>
  </div>
  <!-- end of sidebar -->

</template>

<style lang="postcss">
</style>
