<script lang="ts">
export let text: string;
export let removeCallback: () => void = undefined;
</script>

<div class="bg-blue-100 inline-flex items-center text-sm rounded mt-2 mr-1">
  <span class="mx-2 leading-relaxed truncate max-w-xs">{text}</span>
  {#if removeCallback}
    <button
      on:click="{removeCallback}"
      class="w-6 h-8 inline-block align-middle text-gray-500 hover:text-gray-600 focus:outline-none">
      <svg
        class="w-6 h-6 fill-current mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        ><path
          fill-rule="evenodd"
          d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
        ></path
        ></svg>
    </button>
  {/if}
</div>
