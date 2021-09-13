<script lang="ts">
import SvelteTooltip from "svelte-tooltip";

export let value: string;
$: tooltip = value.length > 32 ? `${value.substring(0, 31)}...` : value;

export let callback = undefined;
export let right = false;
export let left = false;
export let top = false;
export let bottom = false;
export let notification: boolean = false;
</script>

<div class="text-white">
  {#if typeof callback === "undefined"}
    <SvelteTooltip
      tip="{tooltip}"
      right="{right}"
      left="{left}"
      top="{top}"
      bottom="{bottom}">
      <svg data-jdenticon-value="{value}" width="40" height="40">
        {value}
      </svg>
      {#if notification}
        <span
          class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"
        ></span>
      {/if}
    </SvelteTooltip>
  {:else}
    <SvelteTooltip
      tip="{tooltip}"
      right="{right}"
      left="{left}"
      top="{top}"
      bottom="{bottom}">
      <button on:click="{callback}" data-tooltip="{value}">
        <div class="rounded-full">
          <svg data-jdenticon-value="{value}" width="40" height="40">
            {value}
          </svg>
          {#if notification}
            <span
              class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"
            ></span>
          {/if}
        </div>
      </button>
    </SvelteTooltip>
  {/if}
</div>
