<script lang="ts">
//api
import { acceptInvitation } from "../../api/presentationAxios";
//ECMA imports
import swal from "sweetalert";
//components
import Button from "../ui/Button.svelte";
import { slideOverContent } from "../../stores/ui";

let urlInput: string;
const onKeyPress = (e) => {
  //13 === enter
  if (e.charCode === 13 && urlInput) {
    acceptInvitationApiCall(urlInput);
    //error
  }
};
//NOTE:weird implementation but allows for both 'enter' and the sumbit button to work
async function acceptInvitationApiCall(url: string) {
  if (urlInput) {
    let response = await acceptInvitation({ url: urlInput });
    if (response) {
      swal({
        title: "Success",
        text: `You have submitted the encrypted data for processing`,
        icon: "success",
        button: "Great!",
      }).then(slideOverContent.set(null));
    } else {
      swal({
        title: "something went wrong",
        text: "please ensure you have pasted the url from the QrCode in the input box. Otherwise, please contact us for it may be on our end.",
        icon: "error",
      });
    }

    //error
  }
}
</script>

<template>
  <h1>Hello there!, you will have to submit the url here</h1>

  <Button
    label="submit"
    callback="{() => {
      acceptInvitationApiCall(urlInput);
    }}" />
  <input
    bind:value="{urlInput}"
    on:keypress="{onKeyPress}"
    type="text"
    placeholder="paste the url and press enter" />
</template>
