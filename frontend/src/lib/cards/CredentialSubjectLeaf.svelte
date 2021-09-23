<script lang="ts">
import { camel2Title } from "../../utils/camel2Title";

export let title: string;
export let text: string;
</script>

<div class="sm:col-span-1">
  <dt class="sm:col-span-2 text-sm font-medium text-gray-500">
    {camel2Title(title)}
  </dt>
  <dd class="mt-1 text-sm text-gray-900 truncate">
    {text}
  </dd>
</div>
