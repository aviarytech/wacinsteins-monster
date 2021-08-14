<script lang="ts">
  //components
  import Sidebar from "./lib/Sidebar.svelte";
  import SearchBar from "./lib/SearchBar.svelte";
  import Profile from "./lib/Profile.svelte";
  import Login from "./routes/Login.svelte";
  //routes
  import Home from "./routes/Home.svelte";
  import Connections from "./routes/Connections.svelte";
  import Credentials from "./routes/Credentials.svelte";
  import Messages from "./routes/Messages.svelte";
  import Presentations from "./routes/Presentations.svelte";
  import Logout from "./routes/Logout.svelte";
  import Loading from "./routes/Loading.svelte";
  //js imports
  import { Router, Route } from "svelte-navigator";
  import SlideOver from "./lib/SlideOver.svelte";

  import { slideOverContent } from "./stores/ui";
  import AuthGuard from "./lib/AuthGuard.svelte";
</script>

<AuthGuard>
  <svelte:fragment slot="loading">
    <Router>
      <Route path="">
        <Loading />
      </Route>
    </Router>
  </svelte:fragment>
  <svelte:fragment slot="not_authed">
    <Router>
      <Route path="">
        <Login />
      </Route>
      <Route path="login">
        <Login />
      </Route>
    </Router>
  </svelte:fragment>

  <div class="h-screen flex overflow-hidden bg-gray-100" slot="authed">
    <Router>
      <Sidebar />
      <!-- start of the main content -->
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          >
            <span class="sr-only">Open sidebar</span>
            <!-- Heroicon name: outline/menu-alt-2 -->
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <div class="flex-1 px-4 flex justify-between">
            <div class="flex-1 flex">
              <SearchBar />
            </div>

            <div class="ml-4 flex items-center md:ml-6">
              <button
                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">View notifications</span>
                <img
                  src="./assets/outlineBell.svg"
                  alt="notification"
                  class="icon"
                />
              </button>
              <Profile />
            </div>
          </div>
        </div>

        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-6">
            <div class="mx-auto px-4 sm:px-6 md:px-8">
              <!-- Replace with your content -->
              <div class="py-4">
                <Route path="">
                  <Home />
                </Route>

                <Route path="credentials">
                  <Credentials />
                </Route>

                <Route path="presentations">
                  <Presentations />
                </Route>

                <Route path="messages">
                  <Messages />
                </Route>

                <Route path="connections">
                  <Connections />
                </Route>

                <Route path="logout">
                  <Logout />
                </Route>
              </div>
              <!-- /End replace -->
            </div>
          </div>
        </main>
      </div>

      {#if $slideOverContent}
        <SlideOver />
      {/if}
    </Router>
  </div>
</AuthGuard>

<style global lang="postcss">
  /*WARN: is there a global file we can create and reference in tailwind.config.cjs otherwise App.svelte is the most appropriate place for global css*/
  .icon {
    @apply text-gray-400  mr-3 flex-shrink-0 h-6 w-6;
    group-hover: text-gray-500;
  }
</style>
