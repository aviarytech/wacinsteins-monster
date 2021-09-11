<style lang="postcss">
</style>

<script lang="ts">
//components import
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import Image from "../lib/table-elements/Image.svelte";
import Messenger from "../lib/Messenger.svelte";
import Avatar from "../lib/Avatar.svelte";
//api
import { getContacts } from "../api/contactsAxios";
//stores
import { availableContacts } from "../stores/contacts";
import { selectedUser } from "../stores/messages";
import { sha256 } from "../utils/sha256";
//ecma imports
import { onMount } from "svelte";
import { io } from "socket.io-client";
//env
const backendUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;

//TODO: move all of the socket logic in a separate ts or store file.

let socket;
let initMessenger = false;
onMount(async () => {
  const res = await getContacts();
  socket = io(`${backendUrl}/chat`, {
    secure: false,
    reconnect: true,
    rejectUnauthorized: false,
    transports: ["websocket"],
  });
  //console.log(res);

  //WARN: future point of failure
  if (res.length > 0 && !$selectedUser) {
    selectedUser.set(res[0]["did"]);
    socket.emit("joinRoom", $selectedUser);
  }
  availableContacts.set(res);
  initMessenger = true;
});
function openConversation(id: string) {
  socket.emit("leaveRoom", $selectedUser);
  selectedUser.set(id);
  socket.emit("joinRoom", $selectedUser);
}
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-white rounded-xl">
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
      <div class="flex-1 relative z-0 flex overflow-hidden">
        <main
          class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
          <!-- Start main area-->
          <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
            {#if initMessenger}
              <Messenger socket="{socket}" />
            {/if}
          </div>
          <!-- End main area -->
        </main>
        <aside
          class="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
          <!-- Start secondary column (hidden on smaller screens) -->
          <div
            class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <DataTable
              headers="{['', 'Domain']}"
              data="{$availableContacts.map((p) => {
                return [
                  {
                    component: Avatar,
                    value: p['did'],
                    callback: () => {
                      openConversation(p['did']);
                    },
                    dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
                  },
                  {
                    component: Text,
                    text: p['did'],
                    classes: 'truncate',
                  },
                ];
              })}" />
          </div>
          <!-- End secondary column -->
        </aside>
      </div>
    </div>
  </div>
</template>
<!-- clickable: "http://localhost:3000/" -->
