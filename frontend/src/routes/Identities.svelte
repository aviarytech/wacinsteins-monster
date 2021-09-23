<script lang="ts">
//components
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Button from "../lib/ui/Button.svelte";
import Image from "../lib/table-elements/Image.svelte";
import Avatar from "../lib/ui/Avatar.svelte";
//ecma imports
import { onMount } from "svelte";
//stores
import { identities } from "../stores/identities";
import { slideOverContent } from "../stores/ui";
import { user } from "../stores/user";

//utils
import { sha256 } from "../utils/sha256";
//api
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
