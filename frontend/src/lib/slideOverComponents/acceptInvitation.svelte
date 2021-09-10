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
        text: `You have accepted the invitation.`,
        icon: "success",
        button: "Great!",
      }).then(slideOverContent.set(null));
    } else {
      swal({
        title: "Error",
        text: "Please ensure you have submitted a valid Invitation URL.",
        icon: "error",
      });
    }

    //error
  }
}
</script>

<template>
  <h1>Enter a valid Invitation URL</h1>

  <Button
    label="submit"
    callback="{() => {
      acceptInvitationApiCall(urlInput);
    }}" />
  <input
    bind:value="{urlInput}"
    on:keypress="{onKeyPress}"
    type="text"
    placeholder="Enter a valid Invitation URL" />
</template>
