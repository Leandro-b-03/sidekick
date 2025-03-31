<script setup lang="ts">
const router = useRouter();

  const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  rows: {
    type: Number,
    default: 0
  },
  totalRecords: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  }
});

const rowsPerPageOptions = [10, 20, 30];
const last = ref(props.totalRecords / props.perPage);

const onPageChange = (event: { first: number }): void =>{
  scrollToTop();
  const newPage = event.page + 1; // PrimeVue pages are 0-indexed, so add 1
  const newPerPage = event.rows;
  router.push({
    query: {
      ...router.currentRoute.value.query,
      page: newPage,
      per_page: newPerPage
    }
  });
};
</script>

<template>
  <div class="bg-surface-0 dark:bg-surface-900 mt-4 shadow rounded">
    <Paginator :first="rows" :last="last" :rows="perPage" :totalRecords="totalRecords" :rowsPerPageOptions="rowsPerPageOptions" @page="onPageChange">
      <template #start>
          {{ $t('common.total') }} {{ totalRecords }}
      </template>
      <template #end></template>
    </Paginator>
  </div>
</template>