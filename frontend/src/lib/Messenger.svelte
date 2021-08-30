<script lang="ts">
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
  {#each localArray as entry}
    <li>{entry}</li>
  {/each}
  </ul>
</template>
