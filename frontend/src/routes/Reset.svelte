<script lang="ts">
import axios from "axios";

import { onMount } from "svelte";
import { useNavigate } from "svelte-navigator";
import { reset } from "../api/reset";
const navigate = useNavigate();

onMount(async () => {
  await reset();
  navigate("/");
});
</script>
