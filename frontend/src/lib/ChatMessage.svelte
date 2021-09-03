<script lang="ts">
//component imports 
import Image from "./table-elements/Image.svelte";

export let message:Object;

//WARN: because the way it is implemented we need to know whether we are in production or dev(localhost) otherwise the css isn't generated proprely.
const production:boolean = true
//console.log(`did:web:${window.location.host}`)

let messageClass:string
if (production) {
messageClass = message.from === `did:web:${window.location.host}` ? 'sent':'received' ;
} else {
messageClass = message.from === `did:web:localhost:3100` ? 'sent':'received' ;
}
//TODO: change the avatars because the initials are all DW
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
