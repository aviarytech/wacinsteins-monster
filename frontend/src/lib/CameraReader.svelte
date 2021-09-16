<style lang="postcss">
/*.video {
  width: 640px;
  height: 370px;
  background-color: pink;
}
*/
</style>

<script lang="ts">
//ECMA imports
import { onMount } from "svelte";
import swal from "sweetalert";
//components
import Button from "./ui/Button.svelte";
import Image from "./table-elements/Image.svelte";

let video;
let qrScanner;
let fileQrResult: string;
$: fileQrResult;
let WxH: number = 640;
//TODO: is there a better way than using the dom?
onMount(() => {});

let clickedFlag: boolean = false;
function startCamera() {
  if (!true) {
    swal({
      title: "No camera detected",
      text: `Please ensure a camera is available`,
      icon: "error",
    });
  }
  if (!clickedFlag) {
    clickedFlag = !clickedFlag;
  } else {
    clickedFlag = !clickedFlag;
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
  <video id="videoElem" class="video" bind:this="{video}"
    ><track kind="captions" /></video>
</template>
