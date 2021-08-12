<script lang="ts">
  import jsonld from "jsonld";

  export let credential: object;
  let nquads = [];
  let subjects = {};
  let visibleSubjectIndex = 0;
  let ready: Promise<boolean> = new Promise(() => {});
  let visible = [];
  $: if (Object.entries(subjects).length > 0) {
    visible = Object.entries(subjects)[visibleSubjectIndex];
    visible = Object.values(visible[1]);
    // console.log(Object.values(visible[1]));
    // console.log(typeof Object.values(visible[1]));
  }
  (async () => {
    const canon = await jsonld.canonize(credential["data"], {
      algorithm: "URDNA2015",
      format: "application/n-quads",
    });

    nquads = canon
      .split("\n")
      .map((r) => {
        r = r.split(" ");
        const s = r.shift();
        const p = r.shift();
        r.pop();
        return {
          s: s,
          p: p,
          o: [...r].join(" "),
        };
      })
      .filter((r) => r.s);
    nquads.forEach((r) => {
      if (!subjects[r.s]) {
        subjects[r.s] = [];
      }
      subjects[r.s].push(r);
    });
    // console.log(subjects);
    Promise.resolve(ready);
  })();

  const clicked = (e) => {
    console.log(e);
  };
</script>

<template>
  <div class="mt-6 sm:mt-2 2xl:mt-5">
    <div class="border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          {#each Object.keys(subjects) as s, i}
            <button
              on:click={() => {
                visibleSubjectIndex = i;
              }}
              class="border-pink-500 text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              aria-current="page"
            >
              {s}
            </button>
          {/each}
        </nav>
      </div>
    </div>
  </div>
  <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
    {#await ready}
      {#each visible as v}
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">{v.p}</dt>
          <dd class="mt-1 text-sm text-gray-900">{v.o}</dd>
        </div>
      {/each}
    {/await}
  </dl>
</template>
