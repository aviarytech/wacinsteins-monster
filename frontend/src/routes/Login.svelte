<script lang="ts">
  import { Magic } from "magic-sdk";
  import { user } from "../stores/user";
  import { useNavigate } from "svelte-navigator";

  export let email: string = "";

  export const MAGIC_API_KEY = import.meta.env.VITE_MAGIC as string;
  const magic = new Magic(MAGIC_API_KEY);
  const navigate = useNavigate();

  const login = async () => {
    await magic.auth.loginWithMagicLink({ email });
  };
  const interval = setInterval(async () => {
    if (await magic.user.isLoggedIn()) {
      const meta = await magic.user.getMetadata();
      user.set({ email: meta.email });
      navigate("");
    }
  }, 2000);
  user.subscribe((v) => {
    if (v) {
      clearInterval(interval);
    }
  });
</script>

<div
  class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <div>
      <img
        class="mx-auto h-12 w-auto"
        src="https://media.bitcoinfiles.org/18a10cb9df7102cbb58af3bb653e6d1c4fe4b70d1f039d9e3bb19e4e877578cc"
        alt="AV1"
      />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in
      </h2>
    </div>
    <form class="mt-8 space-y-6" action="#" method="POST">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            bind:value={email}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          on:click|preventDefault={login}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: solid/lock-closed -->
            <svg
              class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          Sign in
        </button>
      </div>
    </form>
  </div>
</div>
