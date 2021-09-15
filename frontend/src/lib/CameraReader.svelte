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
import Button from "./ui/Button.svelte"; //essentially a <button/> html component
import Image from "./table-elements/Image.svelte";

let video;
let qrScanner;
let WxH: number = 250;
//TODO: is there a better way than using the dom?
QrScanner.WORKER_PATH = "./assets/js/qr-scanner-worker.min.js";
onMount(() => {
  qrScanner = new QrScanner(
    //document.getElementById("videoElem"),
    video,
    (result) => console.log("decoded qr code:", result),
    (error) => {
      console.log("qr-scanner encountered an error", error);
    }
  );
});
function startCamera() {
  qrScanner.start();
}
function stopCamera() {
  qrScanner.stop();
}
</script>

<template>
  <Button
    callback="{async () => startCamera()}"
    label="start"
    slotOverLabel="{true}">
    <Image
      src="./assets/svg/outlineCamera.svg"
      alt="use Camera"
      width="{16}"
      height="{16}" />
  </Button>
  <Button callback="{async () => stopCamera()}" label="stop" />
  <video
    id="videoElem"
    class="video"
    bind:this="{video}"
    height="{WxH}"
    width="{WxH}"><track kind="captions" /></video>
</template>
