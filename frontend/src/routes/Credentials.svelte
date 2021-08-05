<script lang="ts">
  import {Person, WithContext} from 'schema-dts';

  const p: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Eve',
    affiliation: {
      '@type': 'School',
      name: 'Nice School',
    },
  };
  console.log(p)
</script>

<template>
credentials
</template>

<style lang="postcss">

</style>


