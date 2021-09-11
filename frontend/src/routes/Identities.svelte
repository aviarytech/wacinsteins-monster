<script lang="ts">
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Button from "../lib/ui/Button.svelte";
import Image from "../lib/table-elements/Image.svelte";

import { onMount } from "svelte";

import { identities } from "../stores/identities";
import { slideOverContent } from "../stores/ui";
import { user } from "../stores/user";
import { sha256 } from "../utils/sha256";
import Avatar from "../lib/Avatar.svelte";
import { getAllIdentities } from "../api/identities";

const openIdentity = (value: string) => {
  slideOverContent.set({
    component: Avatar,
    title: value,
    value: value,
  });
};

onMount(async () => {
  const resp = await getAllIdentities([$user.email]);
  if (resp.length > 0) {
    identities.set(resp);
  }
});
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <DataTable
    headers="{['', 'Identifier', '']}"
    data="{$identities.map((i) => {
      return [
        {
          component: Avatar,
          value: i,
          dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
        },
        // { component: Text, text: i.id, classes: 'max-w-xs' },
        { component: Text, text: i },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => {
                openIdentity(i);
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
