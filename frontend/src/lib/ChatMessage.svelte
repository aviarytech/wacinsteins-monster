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
import Avatar from "./ui/Avatar.svelte";

export let message;
const baseUrl =
  import.meta.env.VITE_ENV_TYPE === "dev"
    ? `did:web:localhost:3100`
    : `did:web:api.${window.location.host}`;
const messageClass = message.from === baseUrl ? "sent" : "received";

const ts = message.when ? new Date(message.when) : null;
</script>

<div class="{`message ${messageClass}`}">
  <Avatar value="{message.from}" />
  <div class="message-text ">
    <p class="rounded-lg">
      <slot name="data" />
    </p>
    {#if ts}
      <time>{ts.toLocaleTimeString()}</time>
    {/if}
  </div>
</div>
