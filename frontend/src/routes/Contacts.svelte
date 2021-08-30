<style lang="postcss">
</style>

<script lang="ts">
//component imports
import Button from "../lib/Button.svelte";
import NewContacts from "../lib/NewContacts.svelte";

// stores
import { slideOverContent } from "../stores/ui";
//js imports
import { onMount } from "svelte";
//api
import { getContacts } from "../api/contactsAxios";
//stores
import { availableContacts } from "../stores/contacts";
import { sha256 } from "../utils/sha256";

let newContactWindowDisplayed:boolean = false
function newContactCreation() {
  slideOverContent.set({
    title: "New Contact",
    component: NewContacts,
  })
  if (newContactWindowDisplayed){
    slideOverContent.set(null)
  }
  newContactWindowDisplayed = !newContactWindowDisplayed
}
onMount(async () => {
  const res = await getContacts();
  console.log(res);
  if (res.length > 0) {
    availableContacts.set(res);
  }
});
//if works close the slider and display a message
</script>

<template>
  <Button label="New Contact" callback={newContactCreation}/>
  <ul>
    {#each $availableContacts as contact}
      <img
        class="h-8 w-8 rounded-full"
        src="{`http://tinygraphs.com/labs/isogrids/hexa16/${sha256(
          contact.id
        )}?theme=seascape&numcolors=4`}"
        alt="" />
      <li> { contact.dids} - {contact.id}</li>
    {/each}
  </ul>
</template>
