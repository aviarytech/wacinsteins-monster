<style lang="postcss">
</style>

<script lang="ts">
import { postNewContact } from "src/api/contactsAxios";

import { contactDropDownOptions } from "../stores/contacts";

let localVal:string[] = ["",""]
function newContactValidator() {
  const payload:string = 'did:' + localVal.join(':')
  console.log(localVal, payload.toLowerCase())
  postNewContact(payload.toLowerCase())
  
  } 
$: contactDropDownOptions
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="../favicon.ico" alt="Av1 icon">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add a new contact
        </h2>

      </div>
      <form class="mt-8 space-y-6"  on:submit|preventDefault={newContactValidator}>
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <select
              bind:value={localVal[0]}
              
              required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
              {#each $contactDropDownOptions as item}
                <option value={item}>
                  {item}
                </option>
              {/each}

            </select>
          </div>
          <div>
            <label for="url" class="sr-only">Url</label>
            <input id="url" name="url" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Url string" bind:value={localVal[1]}>
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: outline/outlineUserAdd -->
        <img class="mx-auto h-6 w-auto" src="../assets/outlineUserAdd.svg" alt="Workflow">
            </span>
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
