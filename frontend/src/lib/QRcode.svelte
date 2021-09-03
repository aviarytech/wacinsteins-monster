<style global lang="postcss">
  .qrcode {
    position:relative
    }
  .scale-20 {
      --tw-scale-x: .2;
      --tw-scale-y: .2;
    }
</style>

<script lang="ts">

  //import QrCode from "svelte-qrcode"
  let  WxH:number = 400
  import QRious from 'qrious';
  import { onMount } from 'svelte';

  const QRcode = new QRious();

  export let errorCorrection = "L";
  export let background = "#fff";
  export let color = "#000";
  export let size = "200";
  export let value = "";
  export let padding = 0;
  export let className = "qrcode";

  let image = '';

  function generateQrCode() {
    QRcode.set({
      background,
      foreground: color,
      level: errorCorrection,
      padding,
      size,
      value,
    });
    
    image = QRcode.toDataURL('image/jpeg');
  }

  $: {
    if(value) {
      generateQrCode();
    }
  }

  onMount(() => {
    generateQrCode();
  });
</script>

<template>
  <img src={image} alt={value} class={className}/>
<!--
  <div class="relative">
    <QrCode value="https://github.com/JonasJs/svelte-qrcode/blob/master/src/lib/qrcode/index.js" errorCorrection="H" size={WxH} class="relative"/>
    <img src="../favicon.png" alt="" width={WxH} height ={WxH} class="absolute inset-0 transform scale-20"/>
  </div>
  -->
</template>
    <!-- <div class="square relative"></div> -->
    <!-- <div class="circle absolute inset-0 transform scale-20"></div> -->

