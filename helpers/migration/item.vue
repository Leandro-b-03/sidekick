<script setup lang="ts">
// import items from '@/pages/items.json';
import type { MagicItemDocumentSave } from '@/interfaces/item.type'

const supabase = useSupabaseClient();
const { locale } = useNuxtApp().$i18n;
const { database, Query } = useAppwrite();
const config = useRuntimeConfig();

// const { documents: itemsData, total: total_ } = await database.listDocuments(
//   config.public.databaseID,
//   config.public.itemsCollectionID,
//   [Query.offset(0), Query.limit(73)]
// );
// const items = ref(itemsData);

console.log('Items:', JSON.stringify(items.value));

const saveSupabase = async (data: CharacterDocumentSave) => {
  try {
    const { data: response, error } = await supabase
      .from('items')
      .insert([data])
      .select('*')
      .single();

    if (error) {
      throw error;
    }
    return response;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

console.log('Items:', items);

for (const item of items) {
  const data: MagicItemDocumentSave = {
    ...item,
    damage: JSON.parse(item.damage[0]),
    evolution_level: JSON.parse(item.evolution_level[0]),
  };
  const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...filteredData } = data;
  const filteredDataFinal = filteredData;
  console.log('Filtered data:', filteredDataFinal);

  // try {
  //   const response = await saveSupabase(filteredDataFinal);
  //   console.log('Document saved successfully:', response);
  // } catch (error) {
  //   console.error('Error saving document:', error);
  // }
}
</script>

<template>
  <ITEMSearchCard :items="items" :loading="false" />
</template>