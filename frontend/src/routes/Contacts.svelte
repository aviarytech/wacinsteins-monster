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
import { getContacts } from "../api/contactsAxios";
import { availableContacts } from "../stores/contacts";

function newContactCreation() {
  slideOverContent.set({
    title: "New Contact",
    component: NewContacts,
  })
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
      <li>{contact.id}</li>
    {/each}
  </ul>
</template>
