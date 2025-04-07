<script setup lang="ts">
const { locale } = useNuxtApp().$i18n;
const t = useNuxtApp().$i18n.t;
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const items = ref(null);
const page = ref(Number(route.query.page) || 1);
const perPage = ref(Number(route.query.per_page) || 10);
const rows = computed(() => (page.value - 1) * perPage.value);
const offset = computed(() => (page.value - 1) * perPage.value);
const total = ref(0);
const loading = ref(false);
const panelCollapsed = ref(true);

const { data: classesData, status: statusClasses, error: errorClasses, refresh: refreshClasses, clear: clearClasses } = await useAsyncData(
  'classes',
  () => $fetch(`${config.public.url}tables/classes.json`)
);
const { data: damages, status: statusDamages, error: errorDamages, refresh: refreshDamages, clear: clearDamages } = await useAsyncData(
  'damages',
  () => $fetch(`${config.public.url}tables/damage_type.json`)
);
const { data: types, status: statusTypes, error: errorTypes, refresh: refreshTypes, clear: clearTypes } = await useAsyncData(
  'types',
  () => $fetch(`${config.public.url}tables/types.json`)
);
const { data: wondrousItems, status: statusWondrousItems, error: errorWondrousItems, refresh: refreshWondrousItems, clear: clearWondrousItems } = await useAsyncData(
  'wondrousItems',
  () => $fetch(`${config.public.url}tables/wondrous_items.json`)
);
const { data: rarities, status: statusRarities, error: errorRarities, refresh: refreshRarities, clear: clearRarities } = await useAsyncData(
  'rarities',
  () => $fetch(`${config.public.url}tables/rarities.json`)
);
const { data: weapons, status: statusWeapons, error: errorWeapons, refresh: refreshWeapons, clear: clearWeapons } = await useAsyncData(
  'weapons',
  () => $fetch(`${config.public.url}tables/weapons.json`)
);

const initialValues = reactive({
  class_: classesData.value[0],
  damage: damages.value[0],
  type: types.value[0],
  wondrous_items: wondrousItems.value[0],
  rarity: rarities.value[0],
  weapons: weapons.value[0],
});

const resolver = ({ values }) => {
  const errors = {};
  const requiredFields = [
    'type', 'class_', 'rarity', 'damage'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = [{ message: `${field} is required.` }];
    }
  });
  return { values, errors };
};

const onFormSubmit = async ({ values, valid }) => {
  if (!valid) return;

  panelCollapsed.value = true;
  loading.value = true;

  let search = '';

  Object.entries(values).map(([key, value]) => {
    if (value.value !== 'random') {
      search += `${key}=${value.value},`;
    }
  });

  router.push({
    params: {
      id: search
    }
  });
};

 /**
 * Fetches documents from the Supabase 'items' table based on route search parameters,
 * applying pagination and ordering.
 *
 * @param {object} route - The route object (e.g., from Vue Router) containing params or query.
 */
const fetchDocuments = async () => {
  const search_ = route.params?.search || route.query?.search || '';
  const searchFilters = search_.split(',').filter(s => s.trim() !== '');

  try {
    let query = supabase
      .from('items')
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

    items.value = data || [];
    total.value = count || 0;
  } catch (error) {
    console.error('Failed to execute fetchDocuments:', error);
    items.value = [];
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



useSeoMeta({
  title: `${t('generate.items.list')} - ${t('sidekick')}`,
});
</script>

<template>
  <ITEMForm
    :loading="loading"
    :onFormSubmit="onFormSubmit"
    :classesData="classesData"
    :damages="damages"
    :types="types"
    :wondrousItems="wondrousItems"
    :rarities="rarities"
    :weapons="weapons"
    :initialValues="initialValues"
    :resolver="resolver"
    :panelCollapsed="panelCollapsed"
    />

  <ITEMSearchCard 
    :loading="loading"
    :items="items"/>

  <CommonPagination :page="page" :rows="rows" :perPage="perPage" :totalRecords="total" />
</template>