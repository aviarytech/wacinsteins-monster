<script lang="ts">
  import { Magic } from "magic-sdk";
  import { onMount } from "svelte";
  import { useNavigate } from "svelte-navigator";
  import { user } from "../stores/user";

  export const MAGIC_API_KEY = import.meta.env.VITE_MAGIC as string;
  const magic = new Magic(MAGIC_API_KEY);
  const navigate = useNavigate();

  onMount(async () => {
    console.log(magic.user.getIdToken);
    await magic.user.logout();
    user.set(null);
    navigate("/login");
  });
</script>

<h1>Logging out..</h1>
