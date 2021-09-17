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
import Avatar from "../lib/Avatar.svelte";
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
  slideOverContent.set({
    title: `Contact Profile of ${id}`,
    component: Avatar,
    value: id,
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
  }).then(async (value) => {
    if (value) {
      await deleteContact(id);
      const res = await getContacts();
      //console.log(res);
      if (res) {
        availableContacts.set(res);
      }
    }
  });
}

//conversation button
const navigate = useNavigate();
function openConversation(id: string) {
  selectedUser.set(id);
  navigate("/messages");
}
</script>

<template>
  <div class="bg-white shadow-md rounded-sm p-5">
    <div class="pb-2">
      <Button label="New Contact" callback="{newContactCreation}" />
    </div>
    <DataTable
      headers="{['', 'Domain', 'Created', '']}"
      data="{$availableContacts.map((p) => {
        return [
          {
            component: Avatar,
            value: p['did'],
            dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
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
                callback: () => deleteContactApi(p['id']),
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
  </div>
</template>
