<style lang="postcss">
</style>

<script lang="ts">
//component imports
import Button from "../lib/ui/Button.svelte";
import NewContacts from "../lib/NewContacts.svelte";
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import Image from "../lib/table-elements/Image.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import ContactProfile from "../lib/ContactProfile.svelte";
// stores
import { slideOverContent } from "../stores/ui";
import { selectedUser } from "../stores/messages";
import { availableContacts } from "../stores/contacts";
//ecma imports
import { onMount } from "svelte";
import swal from "sweetalert";
import { useNavigate } from "svelte-navigator";
//api
import { getContacts, deleteContact } from "../api/contactsAxios";
//utils
import { sha256 } from "../utils/sha256";

onMount(async () => {
  const res = await getContacts();
  //console.log(res);
  if (res.length > 0) {
    availableContacts.set(res);
  }
});
let newContactWindowDisplayed: boolean = false;
async function newContactCreation() {
  slideOverContent.set({
    title: "New Contact",
    component: NewContacts,
  });
  if (newContactWindowDisplayed) {
    slideOverContent.set(null);
  }
  newContactWindowDisplayed = !newContactWindowDisplayed;
}

//view button
let rightPreviewWindowDisplayed: boolean = false;
function viewContactProfile(id: string) {
  console.log("open click", id);
  slideOverContent.set({
    title: `Contact Profile or ${id}`,
    component: ContactProfile,
  });
  if (rightPreviewWindowDisplayed) {
    slideOverContent.set(null);
  }
}

//delete Button
async function deleteContactApi(id) {
  swal({
    title: "Are you sure?",
    text: "All previous data will be kept should you add the organization again.",
    icon: "warning",
    buttons: [true, true],
    dangerMode: true,
  }).then((value) => {
    if (value) {
      deleteContact(id);
      window.location.reload();
    }
  });
}

//conversation button
const navigate = useNavigate();
function openConversation(id: string) {
  console.log("open click", id);
  selectedUser.set(id);
  navigate("/messages");
  //BUG: need to join a chatroom websocket
}
</script>

<template>
  <div class="pb-2">
    <Button label="New Contact" callback="{newContactCreation}" />
  </div>
  <!-- TODO: once the user selects a conversation the menu shoudl split in 3-->
  <DataTable
    headers="{['', 'Domain', 'Created', '']}"
    data="{$availableContacts.map((p) => {
      console.log(p);
      return [
        {
          component: Image,
          src: `https://www.tinygraphs.com/labs/isogrids/hexa16/${sha256(
            p['id']
          )}?theme=seascape&numcolors=4`,
          alt: p['did'],
          width: 32,
          height: 32,
          dataTableSpecialClass: '',
        },
        {
          component: Text,
          text: p['did'],
        },
        {
          component: Text,
          text: new Date(p['created_at']).toLocaleString(),
        },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => viewContactProfile(p['did']),
              label: 'View',
            },
            {
              component: Button,
              callback: () => deleteContactApi(p['did']),
              label: 'Delete',
            },
            {
              component: Button,
              callback: () => openConversation(p['did']),
              label: 'Conversation',
            },
          ],
        },
      ];
    })}" />
</template>
