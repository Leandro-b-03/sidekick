<script setup lang="ts">
const { database, Query } = useAppwrite();
const config = useRuntimeConfig();

const npcs = ref([]);
const items = ref([]);
const combats = ref([]);

const databaseID = config.public.databaseID;
const loading = ref(false);

const fetchNPC = async () => {
  try {
    const { documents: npcsData } = await database.listDocuments(databaseID, config.public.npcCollectionID, [ Query.limit(4)]);
    npcs.value = npcsData;
  } catch (error) {
    console.log(error);
  }
};

const fetchItems = async () => {
  try {
    const { documents: itemsData } = await database.listDocuments(databaseID, config.public.itemsCollectionID, [ Query.limit(4)]);
    items.value = itemsData;
  } catch (error) {
    console.log(error);
  }
};

const fetchCombats = async () => {
  try {
    const { documents: combatsData } = await database.listDocuments(databaseID, config.public.combatsCollectionID, [ Query.limit(4)]);
    combats.value = combatsData;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  loading.value = true
  await fetchNPC();
  await fetchItems();
  await fetchCombats();
  loading.value = false
});
</script>

<style>

</style>

<template>
  <div class="bg-surface-50 dark:bg-surface-950">
    <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow !rounded border border-gray-200 dark:border-gray-800">
      <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-2">{{ $t('home.cards.title') }}</div>
      <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('home.cards.description') }}</div>
    </div>

    <div class="w-full mt-4">
      <h2 class="text-2xl font-medium text-surface-900 dark:text-surface-0 mb-4">{{ $t('home.cards.npcs') }}</h2>
      <div class="flex flex-row flex-wrap gap-4">
        <NPCSearchCard :npcs="npcs" :loading="loading" />
      </div>
    </div>

    <div class="w-full mt-4">
      <h2 class="text-2xl font-medium text-surface-900 dark:text-surface-0 mb-4">{{ $t('home.cards.items') }}</h2>
      <div class="flex flex-row flex-wrap gap-4">
        <ITEMSearchCard :items="items" :loading="loading" />
      </div>
    </div>

    <div class="w-full mt-4">
      <h2 class="text-2xl font-medium text-surface-900 dark:text-surface-0 mb-4">{{ $t('home.cards.combats') }}</h2>
      <div class="flex flex-row flex-wrap gap-4">
        <COMBATSearchCard :combats="combats" :loading="loading" />
      </div>
    </div>
  </div>
</template>