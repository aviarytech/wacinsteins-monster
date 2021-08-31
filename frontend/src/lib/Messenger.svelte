<script lang="ts">
//stores
import ChatMessage from "./ChatMessage.svelte"
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";
import { localMessages } from "../stores/messages";

let chatMsg:string
export function newMsg() {
  if(chatMsg){
    const payload:Object = {
      who:sha256($user.email),
      data: chatMsg,
      when: new Date()
      }

    localMessages.set(n => n.push(payload))
    chatMsg=''
    console.log(payload)
    console.log($localMessages)

    }
  }
const onKeyPress = e => {
  if (e.charCode === 13) {
    newMsg()
  };
};

</script>

<template>

  <div class=''>
    <label for="email" class="block text-sm font-medium text-gray-700">Message</label>
    <div class="mt-1">
      <input 
      bind:value={chatMsg}
      on:keypress={onKeyPress}
      type="text" name="msg-chat" id="msg-chat" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="...">
    </div>
    <img
      class="h-8 w-8 rounded-full"
      src="{`http://tinygraphs.com/labs/isogrids/hexa16/${sha256(
        $user.email
      )}?theme=seascape&numcolors=4`}"
      alt={$user.email} />
  </div>
  <!--TODO: check that the chat is showing -->
  {#each $localMessages as message}
    <svelte:component this={ChatMessage} message={message.message} sender={message.sender} />
  {/each}
  <!-- 
  <ChatMessage message={userMsg1} sender={user2.who} />
  <ChatMessage message={user2Msg1} sender={user2.who} />
  -->

</template>
