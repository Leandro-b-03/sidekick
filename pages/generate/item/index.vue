<script setup lang="ts">
const { locale } = useNuxtApp().$i18n;
const { database, ID, Query } = useAppwrite();
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

const fetchDocuments = async () => {
  const search_ = route.params.search || route.query.search || '';
  const search = search_.split(',');
  try {
    const { documents: npcsData, total: total_ } = await database.listDocuments(
      config.public.databaseID,
      config.public.itemsCollectionID,
      [
        Query.limit(perPage.value),
        Query.offset(offset.value),
        Query.orderDesc('$createdAt'),
        ...search.map((item) => {
          const [key, value] = item.split('=');

          if (!key || value === undefined || key === "" || value === null) {
            console.warn(`Skipping invalid search term: ${item}`);
            return Query.isNotNull("name");
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
    items.value = npcsData;
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