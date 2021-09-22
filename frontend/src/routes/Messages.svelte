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
import Avatar from "../lib/ui/Avatar.svelte";
//api
import { getContacts } from "../api/contactsAxios";
import { postNewMsg2Conversation } from "../api/messagesLogic";
import { getWellKnown } from "../api/wellKnown";
//stores
import { availableContacts } from "../stores/contacts";
import { selectedUser, someoneIsTyping } from "../stores/messages";
//ecma imports
import { onMount } from "svelte";
import { io, Socket } from "socket.io-client";
//utils
import { sha256 } from "../utils/sha256";
//env
const backendUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : `https://api.${window.location.hostname}`;
let userDomain: string; // = roomBuilder($selectedUser)[0];
console.log(userDomain);

//TODO: move all of the socket logic in a separate ts or store file.

let socket: Socket;
let initMessenger: boolean = false;
let newNotification: boolean = false;
let timeoutChatFlag: boolean = false;
$: newNotification;
$: if (initMessenger) {
  if (chatMsg && !timeoutChatFlag) {
    //someoneIsTyping.set(userDomain);
    socket.emit("typingServer", {
      sender: userDomain,
      room: $selectedUser,
    });
    setTimeout(() => (timeoutChatFlag = true), 5000);
  } else {
    socket.emit("doneTypingServer", {
      sender: userDomain,
      room: $selectedUser,
    });
    timeoutChatFlag = false;
    //test
  }
}
onMount(async () => {
  roomBuilder($selectedUser);
  const res = await getContacts();
  res["newNotification"] = newNotification;
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
    //console.log(data);
    playSound("../assets/sounds/notification-new-msg.mp3");
    if (data) {
      let searchResIndex = $availableContacts.findIndex(
        (user) => user["did"] === data.room
      );
      $availableContacts[searchResIndex]["newNotification"] = true;
      //console.log(searchResIndex);
      newNotification = true;
    }
  });
  //triple dot typing
  socket.on("typingClient", (data) => {
    someoneIsTyping.set(data.sender);
    console.log("typing2Client", data);
  });

  socket.on("doneTypingClient", (data) => {
    someoneIsTyping.set(null);
    console.log("doneTyping2Client", data);
  });
});

async function roomBuilder(domainUser: string): Promise<string[]> {
  let wellKnownRes = await getWellKnown();
  userDomain = wellKnownRes.id;
  let room: string = sha256([userDomain, domainUser].sort().join(""));
  console.log(room);
  return [userDomain, room];
}
//notification sound
function playSound(link: string) {
  const audio = new Audio(link);
  audio.play();
}

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
    //websocket new entry
    socket.emit("chatToServer", {
      sender: userDomain,
      room: $selectedUser,
      message: chatMsg,
    });
    chatMsg = "";
    //saving the data to the mongo db
    await postNewMsg2Conversation(fullPayload);
    socket.emit("doneTypingServer", {
      sender: userDomain,
      room: $selectedUser,
    });
  }
}
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-white rounded-sm p-5 shadow-md">
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
                    notification: p['newNotification'],
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
