<style global lang="postcss">
.qrcode {
  position: relative;
}
.scale-20 {
  --tw-scale-x: 0.2;
  --tw-scale-y: 0.2;
}
</style>

<script lang="ts">
//stores
import { qrCodeIdValue } from "../stores/presentation";
//component
import Button from "./ui/Button.svelte";
//ecma imports
import QRious from "qrious";
import { onMount } from "svelte";
import CopyToClipboard from "svelte-copy-to-clipboard";
import swal from "sweetalert";

//default init
const QRcode = new QRious();
//qr default parameters
export let errorCorrection = "H";
export let background = "#fff";
export let color = "#000";
export let size = "";
export let value = "";
export let padding = 0;
export let className = "qrcode items-center";

let image = "";
//if bigger than 360 white padding appears in the picture
let WxH: number = 510;
//creation and assignement of the qrCode to img
function generateQrCode() {
  QRcode.set({
    background,
    foreground: color,
    level: errorCorrection,
    padding,
    size: WxH,
    value: $qrCodeIdValue,
  });

  image = QRcode.toDataURL($qrCodeIdValue);
}

$: {
  if (value) {
    generateQrCode();
  }
}

onMount(() => {
  generateQrCode();
});
//copying function

function copyTest() {
  console.log($qrCodeIdValue);
}
</script>

<template>
  <CopyToClipboard
    text="{$qrCodeIdValue}"
    on:copy="{() => {
      swal({
        title: 'Success',
        text: `you have copied url: ${$qrCodeIdValue}`,
        icon: 'success',
        button: 'Aww yiss!',
      });
    }}"
    on:fail="{() => {
      swal({
        title: 'Something went wrong',
        text: `Unable to copy text. try the QRcode`,
        icon: 'error',
        button: ':(',
      });
    }}"
    let:copy>
    <button class="button" on:click="{copy}">Copy to clipboard</button>
  </CopyToClipboard>
  <!--<div id="clipboard">{$qrCodeIdValue}</div>-->
  <div class="relative">
    <img src="{image}" alt="{value}" class="{className}" />
    <img
      src="./favicon.ico"
      alt=""
      width="{WxH}"
      height="{WxH}"
      class="absolute inset-0 transform scale-20 ml-6" />
  </div>
</template>
