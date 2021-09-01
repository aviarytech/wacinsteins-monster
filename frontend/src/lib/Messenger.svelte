<script lang="ts">
//stores
import ChatMessage from "./ChatMessage.svelte"
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";
import { msgUSerBackend, selectedUser } from "../stores/messages";
import { onMount } from "svelte";
import { getCurrentConversation,postNewMsg2Conversation } from "../api/messagesLogic";

//on click, make a call to the backend and display all messages. originaly only displays the msg of the first contact
//placeholdername
selectedUser.set("did:web:placeholder.bob.com")
onMount(async () => {
  if($selectedUser){
    msgUSerBackend.set(await getCurrentConversation($selectedUser))
  }
})

let chatMsg:string
async function newMsg() {
  if(chatMsg){
    //building the new entry
    const fullPayload:Object = {
      to:$selectedUser,
      data: chatMsg,
      when: new Date()
      }
    chatMsg=''
    console.log(fullPayload)
    await postNewMsg2Conversation(fullPayload)
    //works but I don't like this because I want real time
    msgUSerBackend.set(await getCurrentConversation($selectedUser))
    
    console.log("localMSg",$msgUSerBackend)
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
  

  {#if $msgUSerBackend}
    {#each $msgUSerBackend as message}
      <svelte:component this={ChatMessage} message={message.msg} />
    {/each}
  {:else}
    <svelte:component this={ChatMessage} message={{from:"Aviary Tech",to:'placeholder', data:"This is the start of a new conversation", when: new Date()}}/>
  {/if}
</template>
