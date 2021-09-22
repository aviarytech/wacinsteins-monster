<style>
.camera-reader {
  font-family: "Ropa Sans", sans-serif;
  color: #333;
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

#loadingMessage {
  text-align: center;
  padding: 40px;
  background-color: #eee;
}

#canvas {
  width: 100%;
  width: 640px;
  height: 480px;
}

#output {
  margin-top: 20px;
  background: #eee;
  padding: 10px;
  padding-bottom: 0;
}

#output div {
  padding-bottom: 10px;
  word-wrap: break-word;
}

#noQRFound {
  text-align: center;
}
</style>

<script lang="ts">
//ecma scripts
import { onDestroy, onMount } from "svelte";
import jsQR from "jsqr";
//stores
import { scannedQRCode } from "../stores/presentation";
//component
import Button from "./ui/Button.svelte";

let cameraPosition: string = "environment";
let canvas;
let videoStream;
let video;
let canvasElement;
let loadingMessage; //document.getElementById("loadingMessage");
let outputContainer; // document.getElementById("output");
let outputMessage; // document.getElementById("outputMessage");
let outputData; // document.getElementById("outputData");

onMount(() => {
  canvas = canvasElement.getContext("2d");
  video = document.createElement("video");
});

onDestroy(() => {
  video.remove();
  videoStream.getTracks().forEach((track) => {
    track.stop();
  });
});

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: cameraPosition } })
  .then(function (stream) {
    videoStream = stream;
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  });

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}
function tick() {
  loadingMessage.innerText = "⌛ Loading video...";
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;
    outputContainer.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code) {
      console.log(code.data);
      scannedQRCode.set(code.data);
      //drawLine(
      //  code.location.topLeftCorner,
      //  code.location.topRightCorner,
      //  "#FF3B58"
      //);
      //drawLine(
      //  code.location.topRightCorner,
      //  code.location.bottomRightCorner,
      //  "#FF3B58"
      //);
      //drawLine(
      //  code.location.bottomRightCorner,
      //  code.location.bottomLeftCorner,
      //  "#FF3B58"
      //);
      //drawLine(
      //  code.location.bottomLeftCorner,
      //  code.location.topLeftCorner,
      //  "#FF3B58"
      //);
      //outputMessage.hidden = true;
      //outputData.parentElement.hidden = false;
      //outputData.innerText = code.data;
    } else {
      outputMessage.hidden = false;
      outputData.parentElement.hidden = true;
    }
  }
  requestAnimationFrame(tick);
}
</script>

<template>
  <div class="camera-reader">
    <div id="loadingMessage" bind:this="{loadingMessage}">
      ⌛ Loading video...
    </div>
    <!-- <div class="flex content-center py-2">
      <Button
        callback="{() => {
          if (cameraPosition === 'user') {
            cameraPosition = 'environment';
          } else {
            cameraPosition = 'user';
          }
        }}"
        label="Camera selection" />
      <h2 class="mx-2">
        Camera Position: {cameraPosition}
      </h2>
    </div> -->
    <canvas id="canvas" bind:this="{canvasElement}"></canvas>
    <div id="output" bind:this="{outputContainer}">
      <div id="outputMessage" bind:this="{outputMessage}">
        Scan an invitation QR code
      </div>
      <div hidden>
        <b>Data:</b> <span id="outputData" bind:this="{outputData}"></span>
      </div>
    </div>
  </div></template>
