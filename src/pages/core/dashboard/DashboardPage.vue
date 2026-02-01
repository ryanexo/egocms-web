<script setup lang="ts">
const onError = async () => {
  throw new Error('123123')
}
</script>

<template>
  <div>
    <t-button @click="onError">test</t-button>
  </div>
</template>

<style scoped></style>
