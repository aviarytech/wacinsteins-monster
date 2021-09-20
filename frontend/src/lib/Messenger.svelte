<script lang="ts">
//components
import ChatMessage, { message } from "./ChatMessage.svelte";

//stores
import {
  msgUSerBackend,
  selectedUser,
  someoneIsTyping,
} from "../stores/messages";
//ECAM imports
import { onMount } from "svelte";
//api
import { getCurrentConversation } from "../api/messagesLogic";
import { user } from "../stores/user";
//env
const userDomain =
  import.meta.env.VITE_ENV_TYPE === "dev"
    ? `did:web:localhost:3100`
    : `did:web:api.${window.location.host}`;
//exports
export let socket;

onMount(async () => {
  if ($selectedUser) {
    //loading all messages at the beginning
    msgUSerBackend.set(await getCurrentConversation($selectedUser));
    //we need to get the did domain from the selectedUser and ours (don't know how)
    //console.log($selectedUser);
    //console.log($msgUSerBackend);
  }

  socket.on("error", console.error);
  //all events

  //specific
  socket.on("chatToClient", (data) => {
    //console.log(data);
    if (data.sender === userDomain) {
      msgUSerBackend.set([
        ...$msgUSerBackend,
        {
          msg: {
            data: data.message,
            from: data.sender,
            to: data.room,
            when: new Date(),
          },
        },
      ]);
    } else {
      msgUSerBackend.set([
        ...$msgUSerBackend,
        {
          msg: {
            data: data.message,
            to: data.sender,
            from: data.room,
            when: new Date(),
          },
        },
      ]);
    }
    //console.log($msgUSerBackend);
  });
});

//because ${storename} only grabs the current value we need to introduce reactivity by subscribing (probably exists a way to use $: (value))
//svelte is weird but the best so far
selectedUser.subscribe(async (v) => {
  msgUSerBackend.set(await getCurrentConversation($selectedUser));
});
$: msgUSerBackend;
</script>

<template>
  <!--TODO: surround the entire chat -->
  <h1>you are connected with domain:<bold>{$selectedUser}</bold></h1>
  <div
    class="inset-0 border-2 border-gray-200 border-dashed bg-gray-100 rounded-lg overflow-y-auto overflow-x-hidden min-h-screen ">
    {#if $msgUSerBackend && $msgUSerBackend.length !== 0}
      {#each $msgUSerBackend as message}
        <ChatMessage message="{message.msg}">
          <span slot="data">{message.msg.data} </span>
        </ChatMessage>
        <!--
        <svelte:component this="{ChatMessage}" message="{message.msg}" />
        -->
      {/each}
    {:else}
      <ChatMessage message="{{ from: 'Aviary Tech', to: $user }}">
        <span slot="data">This is the start of a new conversation</span>
      </ChatMessage>
    {/if}
    {#if $someoneIsTyping}
      <ChatMessage
        message="{{
          from: $someoneIsTyping,
          to: userDomain,
        }}">
        <!-- BUG: without a date or data the svg doesn't show and idk why :/-->
        <span slot="data" class="inline-flex">
          {$someoneIsTyping} is typing
          <img src="{'./assets/animations/typing.svg'}" alt="typing" />
        </span></ChatMessage>
    {/if}
  </div>
  <div class="flex bottom-1 space-x-4 w-full"></div>
</template>
