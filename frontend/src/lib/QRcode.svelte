<style global lang="postcss">
.qrcode {
  position: relative;
}
.qr-wrapper {
  height: 510px;
}
</style>

<script lang="ts">
//stores
import { qrCodeIdValue } from "../stores/presentation";
import { slideOverContent } from "../stores/ui";

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
</script>

<template>
  <div class="grid justify-items-center">
    <CopyToClipboard
      text="{$qrCodeIdValue}"
      on:copy="{() => {
        swal({
          title: 'Success',
          text: `you have copied url: ${$qrCodeIdValue}`,
          icon: 'success',
          button: 'Great!',
        }).then(async () => {
          await slideOverContent.set(null);
        });
      }}"
      on:fail="{() => {
        swal({
          title: 'Something went wrong',
          text: `Unable to copy text`,
          icon: 'error',
          button: ':(',
        });
      }}"
      let:copy>
      <button class="button mb-5" on:click="{copy}">Copy to clipboard</button>
    </CopyToClipboard>
  </div>
  <!--<div id="clipboard">{$qrCodeIdValue}</div>-->
  <div class="absolute grid justify-items-center bg-red qr-wrapper">
    <img src="{image}" alt="{value}" class="qrcode" />
    <img
      src="./assets/cube.png"
      alt=""
      class="absolute inset-x-0 w-1/4 mx-auto inset-y-1/3" />
  </div></template>
