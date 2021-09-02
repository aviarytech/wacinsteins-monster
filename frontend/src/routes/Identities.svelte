<script lang="ts">
import DataTable from "../lib/DataTable.svelte";
import Text from "../lib/Text.svelte";
import ComponentList from "../lib/ComponentList.svelte";
import Button from "../lib/Button.svelte";
import Image from "../lib/Image.svelte";

import { onMount } from "svelte";

import { identities } from "../stores/identities";
import { slideOverContent } from "../stores/ui";
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";

const openIdentity = (email: string) => {
  slideOverContent.set({
    component: Text,
    text: email,
    title: `email: ${email}`,
  });
};

onMount(async () => {
  // TODO
  // const resp = await getAllIdentities();
  // if (resp.length > 0) {
  //  identities.set(resp);
  //}
  // TEMP pull users add to identities
  identities.set([
    {
      email: $user.email,
      id: sha256($user.email),
      avatar: `https://www.tinygraphs.com/labs/isogrids/hexa16/${sha256(
        $user.email
      )}?theme=seascape&numcolors=4`,
    },
  ]);
});
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <DataTable
    headers="{['', 'ID', 'Email', '']}"
    data="{$identities.map((i) => {
      console.log(i);
      return [
        {
          component: Image,
          src: i.avatar,
          alt: i.avatar,
          width: 32,
          height: 32,
          dataTableSpecialClass:
            'pl-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs',
        },
        { component: Text, text: i.id, classes: 'max-w-xs' },
        { component: Text, text: i.email },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => {
                openIdentity(i.email);
              },
              label: 'View',
            },
            // {
            //   component: Button,
            //   callback: () => {},
            //   label: 'Rotate',
            // },
            // {
            //   component: Button,
            //   callback: () => {},
            //   label: 'Delete',
            // },
          ],
        },
      ];
    })}" />
{/if}
