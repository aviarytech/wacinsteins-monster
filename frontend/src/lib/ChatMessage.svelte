<style lang="postcss">
.message-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.message {
  display: flex;
  align-items: center;
  margin: 0;
  word-wrap: break-word;
}

.received {
  align-items: flex-start;
}
.sent {
  flex-direction: row-reverse;
}
.sent p {
  color: white;
  background: #0b93f6;
  align-self: flex-end;
  text-align: right;
}
.received p {
  background: #e5e5ea;
  color: black;
  text-align: left;
}
</style>

<script lang="ts">
//component imports
import Image from "./table-elements/Image.svelte";

export let message;
const baseUrl =
  import.meta.env.VITE_ENV_TYPE === "dev"
    ? `did:web:localhost:3100`
    : `did:web:api.${window.location.host}`;
const messageClass = message.from === baseUrl ? "sent" : "received";

//TODO: change the avatars because the initials are all DW
const avatar = `https://avatars.dicebear.com/api/initials/${message.from}.svg`;
const ts = new Date(message.when);
</script>

<div class="{`message ${messageClass}`}">
  <Image
    src="{avatar}"
    alt="{avatar}"
    height="32"
    width="32"
    class="rounded-full" />
  <div class="message-text ">
    <p class="rounded-lg">{message.data}</p>

    <time>{ts.toLocaleTimeString()}</time>
  </div>
</div>
