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
import CameraReader from "../lib/CameraReader.svelte";
//ecma imports
import { onMount, getContext } from "svelte";
import { random } from "jose/util/random";
import init, {
  ExtendedPrivateKey,
  ExtendedPublicKey,
} from "../../node_modules/bsv-wasm-web/bsv_wasm.js"; //"bsv-wasm-web";
import swal from "sweetalert";
import { debounce } from "lodash";
//stores
import { identities, extendedPubKeys } from "../stores/identities";
import { slideOverContent } from "../stores/ui";
import { user } from "../stores/user";
import { scannedQRCode } from "../stores/presentation";
//utils
import { tailwingBgColorizer } from "../utils/tailwind";
import { sha256 } from "../utils/sha256";
//api
import { getServerIdentity } from "../api/identities";

//reactivity
let debounceFlag = false;
$: if ($scannedQRCode && !debounceFlag) {
  const fn = debounce(async () => {
    unknownQRCodeValidation($scannedQRCode);
  }, 150);
  fn();
  close(CameraReader);
}

function unknownQRCodeValidation(qrCode: string) {
  let xpriv_key: string;
  let xpub_key: string;
  scannedQRCode.set(null);
  console.log(qrCode);
  if (qrCode.substring(0, 4) === "xprv") {
    xpriv_key = ExtendedPrivateKey.fromString(qrCode).toString();
    xpub_key = ExtendedPublicKey.fromXPriv(
      ExtendedPrivateKey.fromString(qrCode)
    ).toString();
  } else if (qrCode.substring(0, 4) === "xpub") {
    xpub_key = ExtendedPublicKey.fromString(qrCode).toString();
  } else {
    //repalce with swal
    swal({
      title: "Error",
      text: "The QRcode scanned is invalid. Ensure you have a valid Xpriv or Xpub key QRcode.",
      button: { text: "close" },
      icon: "error",
    });
    return;
  }
  if (!xpriv_key) {
    xpriv_key = "";
  }
  let lenKeyChain: number = $extendedPubKeys ? $extendedPubKeys.length : 0;
  //WARN: repeated to refactor
  //console.log(xpriv_key, xpub_key);
  extendedPubKeys.set([
    ...$extendedPubKeys,
    {
      id: sha256(`${lenKeyChain}-${new Date()}`),
      privKey: xpriv_key,
      pubKey: xpub_key,
    },
  ]);
  debounceFlag = true;
}

const { open, close } = getContext("simple-modal"); //not really an import
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

//XPub/Priv keys
function generateXPriv() {
  //rng
  let small_bytes: any = random(new Uint8Array(32));
  let xpriv_key = ExtendedPrivateKey.fromSeed(small_bytes);
  let xpub_key = ExtendedPublicKey.fromXPriv(xpriv_key);
  //WARN: need a better id method that whatever I created
  let lenKeyChain = $extendedPubKeys ? $extendedPubKeys.length : 0;
  let keyChain = [
    ...$extendedPubKeys,
    {
      id: sha256(`${lenKeyChain}-${new Date()}`),
      privKey: xpriv_key.toString(),
      pubKey: xpub_key.toString(),
    },
  ];
  extendedPubKeys.set(keyChain);
  console.log(xpriv_key, small_bytes, xpub_key.toString(), $extendedPubKeys);
  return xpub_key.toString();
}
function createXKeyPair(): void {
  slideOverContent.set({
    title: `Public Key`,
    component: QRcode,
    value: generateXPriv(),
  });
}

function deleteKey(id: number) {
  //I am sure there is a more svelte way of doing this :(
  let res = $extendedPubKeys.filter((item) => item.id !== id);
  extendedPubKeys.set(res);
}
</script>

<!-- <pre>{JSON.stringify($identities, null, 2)}</pre> -->
{#if $identities}
  <div class="bg-white shadow-md rounded-sm p-5">
    <Button
      label="Scan XQRcode"
      slotOverLabel="{true}"
      callback="{async () => {
        swal('add some text and an input');
      }}"
      additionalClasses="mb-4">
      <Tag
        text="Scan XQRcode"
        bgCol="{tailwingBgColorizer('submitted')}"
        fontColor="text-white" /><Image
        src="./assets/icons/hot.svg"
        alt="Key"
        width="{16}"
        height="{16}" />
    </Button>
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
    <div class="block">
      <Button
        label="New Key Pair"
        slotOverLabel="{true}"
        callback="{async () => createXKeyPair()}"
        additionalClasses="mb-4">
        <Tag text="New Key Pair" /><Image
          src="./assets/icons/key.svg"
          alt="Key"
          width="{16}"
          height="{16}" />
      </Button>
      <Button
        label="Scan XQRcode"
        slotOverLabel="{true}"
        callback="{async () => {
          debounceFlag = false;
          open(CameraReader);
        }}"
        additionalClasses="mb-4">
        <Tag text="Scan XQRcode" /><Image
          src="./assets/icons/camera.svg"
          alt="Key"
          width="{16}"
          height="{16}" />
      </Button>
      <div class="flex">
        <Tag
          text="Keys"
          fontColor="text-white"
          bgCol="{tailwingBgColorizer('submitted')}" />
        <span class="pl-2 flex-grow">Your Extended keys</span>
      </div>
    </div>
    {#if $extendedPubKeys}
      <DataTable
        xOverflowClass="bg-red"
        headers="{['ID', 'XPriv', 'XPub', 'actions']}"
        data="{$extendedPubKeys.map((i) => {
          return [
            { component: Text, text: i.id },
            { component: Text, text: i.privKey },
            { component: Text, text: i.pubKey },
            {
              component: ComponentList,
              items: [
                i.privKey !== ''
                  ? {
                      component: Button,
                      label: 'XPriv',
                      callback: () => {
                        slideOverContent.set({
                          title: `Extended Private Key`,
                          component: QRcode,
                          value: i.privKey,
                        });
                      },
                    }
                  : null,
                {
                  component: Button,
                  label: 'XPub',
                  callback: () => {
                    slideOverContent.set({
                      title: `Extended Public Key`,
                      component: QRcode,
                      value: i.pubKey,
                    });
                  },
                },
                {
                  component: Button,
                  callback: () => deleteKey(i['id']),
                  label: 'Delete',
                },
              ].filter((i) => i),
            },
          ];
        })}" />
    {/if}
  </div>
{/if}
