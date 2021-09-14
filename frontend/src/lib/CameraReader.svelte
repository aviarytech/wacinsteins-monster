<style lang="postcss">
.video {
  width: 640px;
  height: 480px;
  background-color: pink;
  object-fit: "none";
  object-position: -100px;
}
</style>

<script lang="ts">
//ECMA imports
import QrScanner from "qr-scanner";
import { onMount } from "svelte";
//components
import Button from "./ui/Button.svelte";
let video;
let WxH: number = 250;
//TODO: is there a better way than using the dom?
onMount(() => {
  QrScanner.WORKER_PATH = "./assets/js/qr-scanner-worker.min.js";
});
let qrScanner = new QrScanner(
  document.getElementById("videoElem"),
  (result) => console.log("decoded qr code:", result),
  (error) => {
    console.log("qr-scanner encountered an error", error);
  }
);
function takePic() {
  console.log("cheese2");
  qrScanner.start();
}
</script>

<template>
  <Button callback="{async () => takePic()}">Super Temp Button</Button>
  <video id="videoElem" class="video"><track kind="captions" /></video>
</template>
