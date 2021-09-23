<style global lang="postcss">
.qrcode {
  position: relative;
}
.qr-wrapper {
  height: 510px;
}
.scale-30 {
  --tw-scale-x: 0.3;
  --tw-scale-y: 0.3;
}
</style>

<script lang="ts">
//stores
import { slideOverContent } from "../../stores/ui";
//component
import Button from "../ui/Button.svelte";
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
export let value = "";
export let padding = 0;

let image = "";
let wrapper;
let imageWrapper;
//if bigger than 360 white padding appears in the picture
let size: number = 510;
//creation and assignement of the qrCode to img
function generateQrCode() {
  QRcode.set({
    background,
    foreground: color,
    level: errorCorrection,
    padding,
    size: size,
    value: value,
  });

  image = QRcode.toDataURL(value);
}

$: {
  if (value) {
    generateQrCode();
  }
}

onMount(() => {
  size = wrapper.clientWidth;
  imageWrapper.style.height = `${size}px`;
  imageWrapper.style.width = `${size}px`;
  generateQrCode();
});
</script>

<template>
  <div class="grid justify-items-center">
    <CopyToClipboard
      text="{value}"
      on:copy="{() => {
        swal({
          title: 'Copied!',
          text: `${value}`,
          icon: 'success',
          button: 'Done',
        }).then(async () => {
          await slideOverContent.set(null);
        });
      }}"
      let:copy>
      <Button callback="{copy}" additionalClasses="mb-3" label="Copy" />
    </CopyToClipboard>
  </div>
  <!--<div id="clipboard">{$qrCodeIdValue}</div>-->
  <div
    class="grid justify-items-center bg-red qr-wrapper"
    bind:this="{wrapper}">
    <img src="{image}" alt="{value}" class="qrcode" />
    <div class="absolute" bind:this="{imageWrapper}">
      <img src="./assets/cube.png" alt="" class="transform scale-30" />
    </div>
  </div></template>
