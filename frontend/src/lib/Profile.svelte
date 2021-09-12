<style lang="postcss">
.open {
  @apply transition ease-out duration-100 transform opacity-100 scale-100;
}
</style>

<script lang="ts">
import { fade } from "svelte/transition";
import { quintOut } from "svelte/easing";
import { wellKnown } from "../stores/well-known";

//stores
import { Link, Router } from "svelte-navigator";
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";
import Avatar from "./Avatar.svelte";
import closable from "../utils/closable";

let button;
let avatar;
let show = false;
</script>

<!-- Profile dropdown -->
{#if $user}
  <div class="ml-2 relative">
  <div>
      <button
        type="button"
        class="max-w-xs bg-white flex items-center text-sm rounded-full 
               focus:outline-none focus:ring-2 focus:ring-offset-2 
               focus:ring-indigo-500"
        id="user-menu-button"
        aria-expanded="false"
        aria-haspopup="true"
        on:click="{(event) => {
          show = true;
          event.stopPropagation();
        }}">
        <Avatar value="{$wellKnown.id}" left="{true}" />
      </button>
    </div>
    {#if show}
      <div
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg 
               py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none
               transform scale-95"
               transition:fade="{{ x: 200, duration: 500, easing: quintOut }}"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        tabindex="-1"
        use:closable="{() => show = false}">
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <Router>
          <div class="flex items-stretch">
            <div>
              <Link
                class="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-gray-500"
                role="menuitem"
                to="identities"
                id="user-menu-item-0">Identities</Link>
            </div>
            <div>
              <Link
                class="py-2 text-sm text-white hover:text-gray-200"
                role="menuitem"
                to="reset"
                id="user-menu-item-3">⟳</Link>
            </div>
          </div>
          <Link
            to="logout"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-gray-500"
            role="menuitem"
            id="user-menu-item-2">Sign out</Link>
        </Router>
      </div>
    {/if}
    
  </div>
{/if}
