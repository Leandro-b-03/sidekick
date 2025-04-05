<script setup lang="ts">
if (import.meta.client) {
  localStorage.getItem('theme') === 'dark' && document.getElementsByTagName('html')[0].classList.add('p-dark');
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
