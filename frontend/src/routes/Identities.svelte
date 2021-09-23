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
  ExtendedPublicKey,
} from "../../node_modules/bsv-wasm-web/bsv_wasm.js"; //"bsv-wasm-web";
//stores
import { identities } from "../stores/identities";
import { slideOverContent } from "../stores/ui";
import { user } from "../stores/user";
//utils
import { tailwingBgColorizer } from "../utils/tailwind";

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

function generateXPriv() {
  let small_bytes: any = random(new Uint8Array(32));
  let xpriv_key = ExtendedPrivateKey.fromSeed(small_bytes);
  let xpub_key = ExtendedPublicKey.fromXPriv(xpriv_key);
  console.log(xpriv_key, small_bytes, xpub_key.toString());
  return xpub_key.toString();
}
function importXpubKeys(): void {
  slideOverContent.set({
    title: ``,
    component: QRcode,
    value: generateXPriv(),
  });
}
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <Button
    label="xPub"
    slotOverLabel="{true}"
    callback="{async () => importXpubKeys()}"
    additionalClasses="mb-4">
    <Tag text="XPub" /><Image
      src="./assets/icons/key.svg"
      alt="XPub"
      width="{16}"
      height="{16}" />
  </Button>
  <div class="bg-white shadow-md rounded-sm p-5">
    <Tag
      text="You"
      fontColor="text-white"
      bgCol="{tailwingBgColorizer('submitted')}" />
    <span class="pl-2 flex-grow">Your Profile and work organization</span>
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
  </div>
  <div class="bg-white shadow-md mt-10 rounded-sm p-5">
    <Tag
      text="Keys"
      fontColor="text-white"
      bgCol="{tailwingBgColorizer('submitted')}" />
    <span class="pl-2 flex-grow">Your Extended keys</span>
  </div>
{/if}
