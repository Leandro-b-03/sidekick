<script setup lang="ts">
const config = useRuntimeConfig();
const pdf = ref(null);

onMounted(async () => {  
  const glob = import.meta.glob('@/content/books/dnd_dm_5_3_7.pdf', { eager: true });
  if (glob === undefined) {
    console.error('glob is undefined');
    return;
  }
  const path = Object.entries(glob).map((file) => file)[0][1];
  pdf.value = await loadPDF(config.public.url, path);
});
</script>

<template>
  <div class="pdf-object rounded h-[100dvh] overflow-hidden">
    <object v-if="pdf" class="pdf" :data="pdf" type="application/pdf" width="100%" height="100%" />
    <div v-else>
      <p class="text-center text-2xl font-bold text-gray-700 dark:text-gray-300">{{ $t('common.pdf-not-found') }}</p>
    </div>
  </div>
</template>