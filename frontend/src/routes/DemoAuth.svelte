<script lang="ts">
//ECMA imports
import { onMount } from "svelte";
import { navigate } from "svelte-navigator";
//stores
import { user } from "../stores/user";

//WARN: DELETE ME BEFORE FULL PROD
onMount(() => {
  user.set({ email: "demo@aviary.tech" });
  navigate("");
});
</script>
