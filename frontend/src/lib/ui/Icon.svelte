<script lang="ts">
import InlineSVG from "svelte-inline-svg";

export let color = "text-gray-400";
export let width = 16;
export let src = "./assets/icons/search.svg";
export let additionalClass = "";
$: attributes = {
  width,
  class: `fill-current ${color} ${additionalClass}`,
};
</script>

<InlineSVG src="{src}" {...attributes} />
