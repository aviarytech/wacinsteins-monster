<style lang="postcss">
</style>

<script lang="ts">
//component imports
import Button from "../lib/Button.svelte";
import NewContacts from "../lib/NewContacts.svelte";
import DataTable from "../lib/DataTable.svelte";
import Text from '../lib/Text.svelte'
import Image from "../lib/Image.svelte";

// stores
import { slideOverContent } from "../stores/ui";
//ecma imports
import { onMount } from "svelte";
import swal from "sweetalert";
//api
import { getContacts,deleteContact } from "../api/contactsAxios";
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

async function deleteContactApi(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [true,true],
      dangerMode: true,
    })
    .then((value) => {
      if(value){
        deleteContact(id)     
        window.location.reload()
      }
    })
    
  }

onMount(async () => {
  const res = await getContacts();
  console.log(res);
  if (res.length > 0) {
    availableContacts.set(res);
  }
});
function openConversation(id) {
    console.log('open click', id)
  }
//if works close the slider and display a message
</script>

<template>
  <div class='pb-2'>
    <Button label="New Contact" callback={newContactCreation}/>
  </div>
  <!-- TODO: once the user selects a conversation the menu shoudl split in 3-->
  <DataTable
    headers={['SHA256', 'Domain', 'ID', '', '']}
    data={$availableContacts.map((p) => {
      return [
        {
          component: Image,
          src: `http://tinygraphs.com/labs/isogrids/hexa16/${sha256(p['id'])}?theme=seascape&numcolors=4`,
          alt: p['dids'],
          width: 32,
          height: 32,
          dataTableSpecialClass:'',
        },
        {
          component: Text,
          text: p['dids'],
        },
        {
          component: Text,
          text: p['id']
        },

        {
          component: Button,
          label: 'View',
          callback: () => {
            openConversation(p['id']);
          },
        },
        {
          component: Button,
          label: 'Delete',
          callback: () => {
            deleteContactApi(p['id']);
          },
          dataTableSpecialClass: ""
        },
      ];
    })} />
</template>
