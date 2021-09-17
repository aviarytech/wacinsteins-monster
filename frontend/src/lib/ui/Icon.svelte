<script lang="ts">
import InlineSVG from "svelte-inline-svg";

let src = "./assets/icons/search.svg";
$: attributes = {
  width: 16,
  class: "fill-current text-red",
};
</script>

<InlineSVG src="{src}" {...attributes} />
