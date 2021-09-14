<script lang="ts">
//ECMA improts
import QrScanner from "qr-scanner";
import { onMount } from "svelte";
//components
import Button from "./ui/Button.svelte";

//TODO: is there a better way than using the dom?
onMount(() => {
  QrScanner.WORKER_PATH = "./assets/js/qr-scanner-worker.min.js";

  const qrScanner = new QrScanner(
    document.getElementById("videoElem"),
    (result) => console.log("decoded qr code:", result)
  );
});

function takePic() {
  console.log("cheese2");
  //qrScanner.start();
}
</script>

<template>
  <Button callback="{async () => takePic()}" label="">Super Temp Button</Button>
  {#if QrScanner.hasCamera()}
    <video id="videoElem"><track kind="captions" /></video>
  {:else}
    hallo
  {/if}
</template>
