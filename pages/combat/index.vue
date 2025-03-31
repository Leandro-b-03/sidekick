<script setup lang="ts">
const { locale } = useNuxtApp().$i18n;
const { database, ID, Query } = useAppwrite();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const combats = ref(null);
const page = ref(Number(route.query.page) || 1);
const perPage = ref(Number(route.query.per_page) || 10);
const rows = computed(() => (page.value - 1) * perPage.value);
const offset = computed(() => (page.value - 1) * perPage.value);
const total = ref(0);
const loading = ref(true);

const fetchDocuments = async () => {
  const search_ = route.params.search || route.query.search || '';
  const search = search_.split(',');
  try {
    const { documents: combatsData, total: total_ } = await database.listDocuments(
      config.public.databaseID,
      config.public.combatsCollectionID,
      [
        Query.limit(perPage.value),
        Query.offset(offset.value),
        Query.orderDesc('$createdAt'),
        ...search.map((item) => {
          const [key, value] = item.split('=');

          if (!key || value === undefined || key === "" || value === null) {
            console.warn(`Skipping invalid search term: ${item}`);
            return Query.isNotNull("combat_id");
          }
          if (value === 'false') {
            return Query.equal(key, [false]);
          } else if (value === 'true') {
            return Query.equal(key, [true]);
          }
          return Query.equal(key, [value]);
        })
      ]
    );
    combats.value = combatsData;
    total.value = total_;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchDocuments();
  loading.value = false;
});

watch(() => route.query, async () => {
  page.value = parseInt(route.query.page) || 1;
  perPage.value = parseInt(route.query.per_page) || 10;
  offset.value = (page.value - 1) * perPage.value;
  loading.value = true;
  fetchDocuments();
  loading.value = false;
});
</script>

<template>
  <COMBATSearchCard :combats="combats" :loading="loading" />

  <CommonPagination :page="page" :rows="rows" :perPage="perPage" :totalRecords="total" />
</template>