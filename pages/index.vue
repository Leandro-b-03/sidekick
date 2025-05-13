<script setup lang="ts">
const supabase = useSupabaseClient();
const config = useRuntimeConfig();
const t = useNuxtApp().$i18n.t;
const user = useSupabaseUser();

const npcs = ref([]);
const items = ref([]);
const combats = ref([]);

const databaseID = config.public.databaseID;
const loading = ref(false);

const fetchNPC = async () => {
  try {
    const { data } = await supabase
      .from('npcs')
      .select('*, user_npc (*, users (*))')
      .limit(4)
      .order('created_at', { ascending: false });

    npcs.value = data;
  } catch (error) {
    console.log(error);
  }
};

const fetchItems = async () => {
  try {
    const { data } = await supabase
      .from('items')
      .select('*, user_item(*, users(*))')
      .limit(4)
      .order('created_at', { ascending: false });

    items.value = data;
  } catch (error) {
    console.log(error);
  }
};

const fetchCombats = async () => {
  try {
    const { data } = await supabase
      .from('combats')
      .select('*, user_combat(*, users(*))')
      .limit(4)
      .order('created_at', { ascending: false });

    combats.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchNPC();
  await fetchItems();
  await fetchCombats();
  loading.value = false;
});

useSeoMeta({
  title: `${t('home.title')} - ${t('sidekick')}`,
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