<script setup lang="ts">
const props = defineProps({
  card: {
    type: Object as PropType<HTMLElement | null>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// const card = ref<HTMLElement | null>(null);
// card.value = props.card;
</script>

<template>
  <!-- <pdfFrame class="w-full h-full"> -->
    <object :data="card?.outerHTML" type="application/pdf" class="h-full w-full"></object>
  <!-- </pdfFrame> -->
</template>