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
  export let name: string;
  let  WxH:number = 400
</script>

<template>
<!--
  <div class="relative">
    <QrCode value="https://github.com/JonasJs/svelte-qrcode/blob/master/src/lib/qrcode/index.js" errorCorrection="H" size={WxH} class="relative"/>
    <img src="../favicon.png" alt="" width={WxH} height ={WxH} class="absolute inset-0 transform scale-20"/>
  </div>
  -->
</template>
    <!-- <div class="square relative"></div> -->
    <!-- <div class="circle absolute inset-0 transform scale-20"></div> -->

