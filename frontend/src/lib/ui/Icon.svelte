<script lang="ts">
import InlineSVG from "svelte-inline-svg";

export let color = "text-gray-400";
export let width = 16;
export let src = "./assets/icons/search.svg";
$: attributes = {
  width,
  class: `fill-current ${color}`,
};
</script>

<InlineSVG src="{src}" {...attributes} />
