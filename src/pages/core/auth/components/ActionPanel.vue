<script setup lang="ts"></script>

<template>
  <router-view>
    <template #default="{ Component }">
      <transition
        appear
        mode="out-in"
      >
        <div
          class="my-auto flex flex-1 flex-col items-center gap-y-6 p-12 lg:my-0 lg:mt-0 lg:justify-center"
        >
          <component :is="Component" />
        </div>
      </transition>
    </template>
  </router-view>
</template>

<style scoped></style>
