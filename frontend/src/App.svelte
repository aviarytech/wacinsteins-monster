<style global lang="postcss">
/*WARN: is there a global file we can create and reference in tailwind.config.cjs otherwise App.svelte is the most appropriate place for global css*/
.icon {
  @apply text-gray-400  mr-3 flex-shrink-0 h-6 w-6;
  group-hover: text-gray-500;
}
</style>

<script lang="ts">
//components
import Sidebar from "./lib/Sidebar.svelte";
import Profile from "./lib/Profile.svelte";
import SlideOver from "./lib/ui/SlideOver.svelte";
import Router from "./lib/Router.svelte";
//api
import { getAllCredentials } from "./api/credentials";
import { getWellKnown } from "./api/wellKnown";
//stores
import { mobileSidebarClose, slideOverContent } from "./stores/ui";
import { user } from "./stores/user";
import { credentials } from "./stores/credentials";
import { wellKnown } from "./stores/well-known";
//ECMA imports
import { onMount } from "svelte";
import SearchBar from "./lib/SearchBar.svelte";
//HACK: added so that the user doesn't have to go to the credential page to proprely use the presentation page.
onMount(async () => {
  const resp = await getAllCredentials();
  if (resp.length > 0) {
    credentials.set(resp);
  }
  const info = await getWellKnown();
  if (info) {
    wellKnown.set({ ...info, connected: true });
  }
});
</script>

{#if $user}
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidebar />
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <header class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <SearchBar />
          </div>

          <div class="ml-4 flex items-center md:ml-6">
            <!-- <button
              class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">View notifications</span>
              <img
                src="./assets/outlineBell.svg"
                alt="notification"
                class="icon"
              />
            </button> -->
            <Profile />
          </div>
        </div>
      </header>

      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="mx-auto px-2 sm:px-4 md:px-4">
          <div class="py-4">
            <Router />
          </div>
        </div>
      </main>
    </div>

    {#if $slideOverContent}
      <SlideOver />
    {/if}
  </div>
{:else}
  <Router />
{/if}
