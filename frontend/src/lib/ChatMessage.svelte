<script>
import Image from "./Image.svelte";

  export let message;
  const messageClass = message.from === message.to ? 'sent' : 'received';
  const avatar = `https://avatars.dicebear.com/api/initials/${message.from}.svg`;
  const ts = new Date(message.when);
</script>

<div class={`message ${messageClass}`}>
  <Image src={avatar} alt={avatar} height="32" width="32" class="rounded-full"/> 
  <div class="message-text ">
    <p class="rounded-lg">{message.data}</p>

    <time>{ts.toLocaleTimeString()}</time>
  </div>
</div>

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
	word-wrap:break-word;
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
