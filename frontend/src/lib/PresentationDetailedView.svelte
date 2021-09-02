<script lang="ts">
//components
import ComponentList from "./table-elements/ComponentList.svelte";
import Tag from "./ui/Tag.svelte";

export let presentation;

let subjects = {};
let visibleSubjectIndex = 0;
let visible = [];
$: if (Object.entries(subjects).length > 0) {
  visible = Object.values(Object.entries(subjects)[visibleSubjectIndex][1]);
}
</script>

<template>
  <div class="mt-6 sm:mt-2 2xl:mt-5">
    <div class="border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            on:click="{() => {
              visibleSubjectIndex = 0;
            }}"
            class:border-pink-500="{visibleSubjectIndex === 0}"
            class="text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            aria-current="page">
            Definition
          </button>
        </nav>
      </div>
    </div>
  </div>

  <!-- <pre>{JSON.stringify(presentation,null,2)}</pre> -->

  {#if visibleSubjectIndex === 0}
    <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
      <div class="sm:col-span-1 mt-3 ">
        <dt class="text-sm font-medium text-gray-500">ID</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate max-w-xs">
          {presentation.id}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Name</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate max-w-xs">
          {presentation.definition.input_descriptors[0].name}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Schema</dt>
        <dd class="mt-1 text-sm text-gray-900 truncate max-w-xs">
          {presentation.definition.input_descriptors[0].schema}
        </dd>
      </div>
      <div class="sm:col-span-1 mt-3">
        <dt class="text-sm font-medium text-gray-500">Constraints</dt>
        <dd class="mt-1 text-sm text-gray-900 max-w-xs">
          <ComponentList
            items="{presentation.definition.input_descriptors[0].constraints.fields.map(
              (f) => {
                return { component: Tag, text: f.path };
              }
            )}" />
        </dd>
      </div>
    </dl>
  {/if}
</template>
