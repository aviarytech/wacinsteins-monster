<script lang="ts">
//stores

import ChatMessage from "./ChatMessage.svelte"

let localArray:string[]=[''] // WARN:very temp
let chatMsg:string
export function newMsg() {
  console.log(chatMsg, localArray)
  if(chatMsg){
    localArray.push(chatMsg)
    chatMsg=''
    }

  }
const onKeyPress = e => {
  if (e.charCode === 13) {
    newMsg()
  };
};
let user:object = {
    who:"general-Kenobi",
    when:"2020-01-20",
  }
let userMsg1:object = {
    who:"general-Kenobi",
    data:"Hello there",
    when: new Date() 

  }
let user2:object = {
    who:"laber-saber-robot-collector",
  }
let user2Msg1:object = {
    who:"laber-saber-robot-collector",
    data:"general-Kenobi!",
    when: new Date()

  }
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
  </div>
  <ul>
  <!--TODO: check that the chat is showing -->
  <ChatMessage message={userMsg1} sender={user2.who} />
  <ChatMessage message={user2Msg1} sender={user2.who} />
  {#each localArray as entry}
    <li>{entry}</li>
  {/each}
  </ul>
</template>
