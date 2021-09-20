<style>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<script>
import Video from "../lib/Video.svelte";
</script>

<div class="bg-white shadow-md rounded-sm">
  <div class="divide-gray-200">
    <div class="embed-container">
      <Video />
    </div>
  </div>
</div>
