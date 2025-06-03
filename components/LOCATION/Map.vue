<script setup lang="ts">
const props = defineProps({
  location: {
    type: Object as PropType<Record<string, any>>,
    required: true
  },
});
</script>

<template>
  <div class="flex justify-center items-center inset-shadow-sm w-full h-auto inset-shadow-gray-500 dark:inset-shadow-gray-900 map-bg relative">
    <div class="grid grid-cols-1 w-full lg:w-[900px] h-auto lg:h-auto bg-white dark:bg-gray-900 shadow rounded overflow-hidden content-between" ref="pdfSection">
      <div class="absolute inset-0 w-[200px] h-vh bg-white shadow"></div>
      <div class="w-[calc(100% - 200px)] h-[45px] absolute left-[200px] right-0 top-0 flex justify-between items-center bg-[#d5d3d1] p-4 shadow-2xl gap-2">
        <Button icon="pi pi-bars" variant="text" size="small" />
        <InputGroup class="w-[100px] text-black">
          <Button icon="pi pi-search-minus" variant="text" size="small" />
          <InputNumber inputId="percent" suffix="%" fluid class="rounded w-[100px]" />
          <Button icon="pi pi-search-plus" variant="text" size="small" />
        </InputGroup>
      </div>
      <div class="w-[calc(100% - 200px)] absolute inset-x-0 left-[200px] bottom-0 flex justify-center h-10 bg-[#292524]">
      </div>
    </div>
  </div>
</template>