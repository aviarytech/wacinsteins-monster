<script lang="ts">
//stores
import ChatMessage from "./ChatMessage.svelte";
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";
import { msgUSerBackend, selectedUser } from "../stores/messages";
import { onMount } from "svelte";
import {
  getCurrentConversation,
  postNewMsg2Conversation,
  sseSubscription,
} from "../api/messagesLogic";

onMount(async () => {
  if ($selectedUser) {
    // INFO: this is where the subscription needs to happen
    msgUSerBackend.set(await getCurrentConversation($selectedUser));
    await sseSubscription();
  }
});
//because ${storename} only grabs the current value we need to introduce reactivity by subscribing (probably exists a way to use $: (value))
//svelte is weird but the best so far
selectedUser.subscribe(async (v) => {
  msgUSerBackend.set(await getCurrentConversation($selectedUser));
});

let chatMsg: string;
async function newMsg() {
  if (chatMsg) {
    //building the new entry
    const fullPayload: Object = {
      to: $selectedUser,
      data: chatMsg,
      when: new Date(),
    };
    chatMsg = "";

    //console.log(fullPayload)
    //WARN: works but I don't like this because I want real time
    await postNewMsg2Conversation(fullPayload);
    // to remove once subscription works
    //msgUSerBackend.set(await getCurrentConversation($selectedUser))

    console.log("localMSg", $msgUSerBackend);
  }
}
const onKeyPress = (e) => {
  if (e.charCode === 13) {
    newMsg();
  }
};
</script>

<template>
  <h2 class="block text-sm font-medium text-gray-700 content-center">
    Conversation with {$selectedUser}
  </h2>

  <div class="flex absolute bottom-1 space-x-4 w-full">
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
  <!--TODO: surround the entire chat -->

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
</template>
