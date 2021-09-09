<script lang="ts">
//stores
import ChatMessage from "./ChatMessage.svelte";
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";
import { msgUSerBackend, selectedUser } from "../stores/messages";
//ECAM imports
import { io } from "socket.io-client";
import { onMount } from "svelte";
//api
import {
  getCurrentConversation,
  postNewMsg2Conversation,
} from "../api/messagesLogic";
//declaring to remove later errors
let socket = io("http://localhost:3100/chat", {
  secure: false,
  reconnect: true,
  rejectUnauthorized: false,
  transports: ["websocket"],
});
onMount(async () => {
  if ($selectedUser) {
    //loading all messages at the beginning
    msgUSerBackend.set(await getCurrentConversation($selectedUser));
    //we need to get the did domain from the selectedUser and ours (don't know how)
    console.log($selectedUser);
    console.log($msgUSerBackend);
  }
  //socket logic
  socket = io("http://localhost:3100/chat", {
    secure: false,
    reconnect: true,
    rejectUnauthorized: false,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("websocket connected");
  });

  socket.on("disconnect", () => {
    console.log("webscoket disconnected");
  });

  socket.on("error", console.error);
  //all events
  const listener = (eventName, ...args) => {
    console.log(eventName, args);
  };

  socket.onAny(listener);
  //specific
  socket.on("chatToClient", (data) => {
    console.log(data);
  });
});

//because ${storename} only grabs the current value we need to introduce reactivity by subscribing (probably exists a way to use $: (value))
//svelte is weird but the best so far
selectedUser.subscribe(async (v) => {
  msgUSerBackend.set(await getCurrentConversation($selectedUser));
});

//input dom handling
let chatMsg: string;
const onKeyPress = (e) => {
  if (e.charCode === 13) {
    newMsg();
  }
};
async function newMsg() {
  if (chatMsg) {
    //building the new entry for the mongo db
    const fullPayload: Object = {
      to: $selectedUser,
      data: chatMsg,
      when: new Date(),
    };

    //saving the data to the mongo db
    await postNewMsg2Conversation(fullPayload);

    //websocket new entry
    socket.emit("chatToServer", {
      sender: $user,
      room: $selectedUser,
      message: chatMsg,
    });
    chatMsg = "";
  }
}
</script>

<template>
  <!--TODO: surround the entire chat -->
  <h1>you are connected with domain:<bold>{$selectedUser}</bold></h1>
  <div
    class="inset-0 border-2 border-gray-200 border-dashed bg-gray-100 rounded-lg overflow-y-auto">
    {#if $msgUSerBackend}
      {#each $msgUSerBackend as message}
        <svelte:component this="{ChatMessage}" message="{message.msg}" />
      {/each}
    {:else}
      <!--BUG: not working in all situations  -->
      <svelte:component
        this="{ChatMessage}"
        message="{{
          from: 'Aviary Tech',
          to: 'placeholder',
          data: 'This is the start of a new conversation',
          when: new Date(),
        }}" />
    {/if}
  </div>
  <div class="flex bottom-1 space-x-4 w-full">
    <img
      class="h-8 w-8 rounded-full inline-block mt-1.5"
      src="{`https://www.tinygraphs.com/labs/isogrids/hexa16/${sha256(
        $user.email
      )}?theme=seascape&numcolors=4`}"
      alt="{$user.email}" />

    <div class="flex-grow max-w-screen-md">
      <input
        bind:value="{chatMsg}"
        on:keypress="{onKeyPress}"
        type="text"
        name="msg-chat"
        id="msg-chat"
        class="fill-current shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md min-w-max"
        placeholder="Say hello!" />
    </div>
  </div>
</template>
