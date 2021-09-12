<style lang="postcss">
.default {
  @apply inline-flex items-center text-sm rounded mr-1;
}
</style>

<script lang="ts">
export let text: string;
export let removeCallback: () => void = undefined;
export let bgCol: string = "bg-blue-100";
export let fontColor: string = "text-gray-600";
</script>

<div class="{`default ${bgCol} ${fontColor}`}">
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
