<style lang="postcss">
</style>

<script lang="ts">
//components import
import Button from "../lib/Button.svelte";
import DataTable from "../lib/DataTable.svelte";
import Text from '../lib/Text.svelte'
import Image from "../lib/Image.svelte";
import Messenger from "../lib/Messenger.svelte";
//api
import { getContacts } from "../api/contactsAxios";
//stores
import { availableContacts } from "../stores/contacts";
import { sha256 } from "../utils/sha256";
//ecma imports
import { onMount } from "svelte";

onMount(async () => {
  const res = await getContacts();
  console.log(res);
  if (res.length > 0) {
    availableContacts.set(res);
  }
});
function openConversation(id) {
    console.log('click', id)
  }
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-white rounded-xl">
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
      <div class="flex-1 relative z-0 flex overflow-hidden">
        <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
          <!-- Start main area-->
          <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
            <Messenger/>
          </div>
          <!-- End main area -->
        </main>
        <aside class="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
          <!-- Start secondary column (hidden on smaller screens) -->
          <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <DataTable
            headers={['SHA256', 'Domain', '']}
            data={$availableContacts.map((p) => {
              return [
                {
                  component: Image,
                  src: `http://tinygraphs.com/labs/isogrids/hexa16/${sha256(p['id'])}?theme=seascape&numcolors=4`,
                  alt: p['did'],
                  width: 32,
                  height: 32,
                  dataTableSpecialClass:'',
                },
                {
                  component: Text,
                  text: p['did'],
                },
              ];
            })} />
          </div>
          <!-- End secondary column -->
        </aside>
      </div>
    </div>
  </div>
</template>
<!-- clickable: "http://localhost:3000/" -->

