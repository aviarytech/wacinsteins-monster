<script lang="ts">
//components
import DataTable from "../lib/table-elements/DataTable.svelte";
import Text from "../lib/table-elements/Text.svelte";
import ComponentList from "../lib/table-elements/ComponentList.svelte";
import Button from "../lib/ui/Button.svelte";
import Image from "../lib/table-elements/Image.svelte";
import Avatar from "../lib/ui/Avatar.svelte";
import Tag from "../lib/ui/Tag.svelte";
import QRcode from "../lib/slideOverItems/QRcode.svelte";
//ecma imports
import { onMount } from "svelte";
import { random } from "jose/util/random";
import init, {
  ExtendedPrivateKey,
} from "../../node_modules/bsv-wasm-web/bsv_wasm.js"; //"bsv-wasm-web";
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
  await init();
  let ids = [{ role: "You", id: $user.email }];
  const resp = await getServerIdentity();
  if (resp) {
    //console.log(resp.id);
    ids = [...ids, { role: "Server", id: resp.id }];
  }
  identities.set(ids);
});

function generateXPriv(): void {
  let small_bytes: any = random(new Uint8Array(32));
  let xpriv_wasm = ExtendedPrivateKey.fromSeed(small_bytes);
  console.log(xpriv_wasm, small_bytes);
}
function importXpubKeys(): void {
  generateXPriv();
  slideOverContent.set({
    title: ``,
    component: QRcode,
    value: xpriv_wasm,
  });
}
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <Button
    label="xPub"
    slotOverLabel="{true}"
    callback="{async () => importXpubKeys()}">
    <Tag text="XPub" /><Image
      src="./assets/icons/key.svg"
      alt="XPub"
      width="{16}"
      height="{16}" />
  </Button>
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
