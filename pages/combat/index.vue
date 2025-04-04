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

 /**
 * Fetches documents from the Supabase 'combats' table based on route search parameters,
 * applying pagination and ordering.
 *
 * @param {object} route - The route object (e.g., from Vue Router) containing params or query.
 */
 const fetchDocuments = async () => {
  const search_ = route.params?.search || route.query?.search || '';
  const searchFilters = search_.split(',').filter(s => s.trim() !== '');

  try {
    let query = supabase
      .from('combats')
      .select('*', { count: 'exact' });

    searchFilters.forEach((item) => {
      const [key, value] = item.split('=').map(s => s.trim());

      if (!key || value === undefined || value === null || value === '') {
        console.warn(`Skipping invalid search term: "${item}"`);
        return;
      }

      const filterValue = value.toLowerCase() === 'true' ? true :
                          value.toLowerCase() === 'false' ? false : value;

      query = query.eq(key, filterValue);
    });

    query = query.order('created_at', { ascending: false });

    const from = offset.value;
    const to = from + perPage.value - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching documents from Supabase:', error);
      throw error;
    }

    combats.value = data || [];
    total.value = count || 0;
  } catch (error) {
    console.error('Failed to execute fetchDocuments:', error);
    combats.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
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