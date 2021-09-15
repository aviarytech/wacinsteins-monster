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
import { getServerIdentity } from "../api/identities";

const openIdentity = (value: string) => {
  slideOverContent.set({
    component: Avatar,
    title: value,
    value: value,
  });
};

onMount(async () => {
  let ids = [{ role: "You", id: $user.email }];
  const resp = await getServerIdentity();
  if (resp) {
    console.log(resp.id);
    ids = [...ids, { role: "Server", id: resp.id }];
  }
  identities.set(ids);
});
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <DataTable
    xOverflowClass="bg-red"
    headers="{['', 'Role', 'Identifier', '']}"
    data="{$identities.map((i) => {
      return [
        {
          component: Avatar,
          value: i.id,
          dataTableSpecialClass: 'pl-6 py-4 max-w-xs',
        },
        { component: Text, text: i.role },
        { component: Text, text: i.id },
        {
          component: ComponentList,
          items: [
            {
              component: Button,
              callback: () => {
                openIdentity(i.id);
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
