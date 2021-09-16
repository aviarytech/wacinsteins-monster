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
import swal from "sweetalert";
//components
import Button from "./ui/Button.svelte"; //essentially a <button/> html component
import Image from "./table-elements/Image.svelte";

let video;
let qrScanner;
let fileQrResult: string;
$: fileQrResult;
let WxH: number = 250;
//TODO: is there a better way than using the dom?
QrScanner.WORKER_PATH = "./assets/js/qr-scanner-worker.min.js";
onMount(() => {
  qrScanner = new QrScanner(
    //document.getElementById("videoElem"),
    video,
    (result) => {
      console.log("decoded qr code:", result);
      fileQrResult = result;
    },
    (error) => {
      console.log("qr-scanner encountered an error", error);
      fileQrResult = "timeout";
    }
  );
});

let clickedFlag: boolean = false;
function setResult(label, result) {
  label.textContent = result;
  label.style.color = "teal";
  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
    () => (label.style.color = "inherit"),
    100
  );
}
async function startCamera(): Promise<void> {
  if ((await QrScanner.hasCamera()) && clickedFlag === false) {
    clickedFlag = !clickedFlag;
    qrScanner.start();
  } else if (clickedFlag) {
    qrScanner.stop();
    clickedFlag = !clickedFlag;
  } else {
    swal({
      title: "No camera detected",
      text: `Please ensure a camera is available`,
      icon: "error",
    });
  }
}
</script>

<template
  >{fileQrResult}
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
  <video
    id="videoElem"
    class="video"
    bind:this="{video}"
    height="{WxH}"
    width="{WxH}"><track kind="captions" /></video>
</template>
