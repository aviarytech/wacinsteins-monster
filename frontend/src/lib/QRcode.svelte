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
//ecma imports
import QRious from "qrious";
import { onMount } from "svelte";

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
</script>

<template>
  <div class="">
    <img src="{image}" alt="{value}" class="{className}" />
    <img
      src="./favicon.ico"
      alt=""
      width="{WxH}"
      height="{WxH}"
      class="absolute inset-0 transform scale-20 ml-6" />
  </div>
</template>
