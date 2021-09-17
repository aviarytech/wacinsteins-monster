<script lang="ts">
import { roles } from "../stores/roles";
import Tag from "../lib/ui/Tag.svelte";

const toggleRole = (role: string) => {
  roles.set({ ...$roles, [role]: !$roles[role] });
};

export let full: boolean = true;
export let hideDisabled: boolean = true;
</script>

{#if !hideDisabled || $roles["subject"]}
  <Tag
    active="{$roles['subject']}"
    text="{full ? `Subject` : `S`}"
    fontColor="text-white"
    bgCol="bg-red-400"
    callback="{() => {
      toggleRole('subject');
    }}" />
{/if}
{#if !hideDisabled || $roles["holder"]}
  <Tag
    active="{$roles['holder']}"
    text="{full ? `Holder` : `H`}"
    fontColor="text-white"
    bgCol="bg-green-400"
    callback="{() => {
      toggleRole('holder');
    }}" />
{/if}
{#if !hideDisabled || $roles["issuer"]}
  <Tag
    active="{$roles['issuer']}"
    text="{full ? `Issuer` : `I`}"
    fontColor="text-white"
    bgCol="bg-purple-400"
    callback="{() => {
      toggleRole('issuer');
    }}" />
{/if}
{#if !hideDisabled || $roles["verifier"]}
  <Tag
    active="{$roles['verifier']}"
    text="{full ? `Verifier` : `V`}"
    fontColor="text-white"
    bgCol="bg-indigo-400"
    callback="{() => {
      toggleRole('verifier');
    }}" />
{/if}
