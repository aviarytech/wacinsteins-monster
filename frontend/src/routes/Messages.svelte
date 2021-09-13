<style lang="postcss">
.max-h-messenger {
  max-height: 45rem;
}
</style>

<script lang="ts">
//components import
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import Messenger from "../lib/Messenger.svelte";
import Avatar from "../lib/Avatar.svelte";
//api
import { getContacts } from "../api/contactsAxios";
import { postNewMsg2Conversation } from "../api/messagesLogic";
//stores
import { availableContacts } from "../stores/contacts";
import { selectedUser } from "../stores/messages";
//ecma imports
import { onMount } from "svelte";
import { io, Socket } from "socket.io-client";
//env
const backendUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;
const userDomain =
  import.meta.env.VITE_ENV_TYPE === "dev"
    ? `did:web:localhost:3100`
    : `did:web:api.${window.location.host}`;
//TODO: move all of the socket logic in a separate ts or store file.

let socket: Socket;
let initMessenger: boolean = false;
let newNotification: boolean = false;
$: newNotification;
onMount(async () => {
  const res = await getContacts();
  console.log(res);
  socket = io(`${backendUrl}/chat`, {
    secure: false,
    reconnect: true,
    rejectUnauthorized: false,
    transports: ["websocket"],
  });

  if (res.length > 0 && !$selectedUser) {
    selectedUser.set(res[0]["did"]);
    socket.emit("joinRoom", $selectedUser);
  }
  availableContacts.set(res);
  initMessenger = true;

  socket.on("chatToClient", (data) => {
    console.log("ding");
    if (data) {
      newNotification = true;
    }
  });
});
function openConversation(id: string) {
  newNotification = false;
  socket.emit("leaveRoom", $selectedUser);
  selectedUser.set(id);
  socket.emit("joinRoom", $selectedUser);
}

//msg input DOM element
let chatMsg: string;
const onKeyPress = (e) => {
  if (e.charCode === 13) {
    newMsg();
  }
};

async function newMsg() {
  if (chatMsg) {
    //building the new entry for the mongo db
    const fullPayload: object = {
      to: $selectedUser,
      data: chatMsg,
      when: new Date(),
    };

    //saving the data to the mongo db
    await postNewMsg2Conversation(fullPayload);

    //websocket new entry
    socket.emit("chatToServer", {
      sender: userDomain,
      room: $selectedUser,
      message: chatMsg,
    });
    chatMsg = "";
  }
}
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-white rounded-xl">
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
      <div class="flex-1 relative z-0 flex overflow-hidden">
        <main class="flex-1 relative z-0 focus:outline-none xl:order-last">
          <!-- Start main area-->
          <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
            {#if initMessenger}
              <!-- INFO: Where all the messages will displays-->
              <div class="max-h-messenger overflow-y-auto">
                <Messenger socket="{socket}" />
              </div>
              <!-- INFO: the chat input box where new messages are created-->
              <div class="flex-grow min-w-full sticky">
                <input
                  bind:value="{chatMsg}"
                  on:keypress="{onKeyPress}"
                  type="text"
                  name="msg-chat"
                  id="msg-chat"
                  class="flex-grow  fill-current shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md min-w-max"
                  placeholder="Say hello!" />
              </div>
            {/if}
          </div>
          <!-- End main area -->
        </main>
        <aside
          class="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
          <!-- Start secondary column (hidden on smaller screens) -->
          <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8 ">
            <DataTable
              tableOverallClass="overflow-hidden"
              xOverflowClass="overflow-x-hidden"
              headers="{['', 'Domain']}"
              data="{$availableContacts.map((p) => {
                return [
                  {
                    component: Avatar,
                    value: p['did'],
                    notification: newNotification,
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
