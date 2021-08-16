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
      avatar: `http://tinygraphs.com/labs/isogrids/hexa16/${sha256(
        $user.email
      )}?theme=seascape&numcolors=2`,
    },
  ]);
});
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <DataTable
    headers="{['', 'ID', 'Email', '']}"
    data="{$identities.map((i) => {
      return [
        {
          component: Image,
          src: i.avatar,
          alt: i.avatar,
          width: 32,
          height: 32,
        },
        { component: Text, text: sha256(i), classes: 'max-w-xs' },
        { component: Text, text: i.email },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => {},
              label: 'View',
            },
            {
              component: Button,
              callback: () => {},
              label: 'Rotate',
            },
            {
              component: Button,
              callback: () => {},
              label: 'Delete',
            },
          ],
        },
      ];
    })}" />
{/if}
