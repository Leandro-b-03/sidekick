<script setup lang="ts">
import type { NpcLocalState, CharacterDocument, CharacterDocumentSaveAppwrite, CharacterDocumentSaveSupabase } from '@/interfaces/npc.type';

const supabase = useSupabaseClient();
const { locale } = useNuxtApp().$i18n;
const { database, Query } = useAppwrite();
const config = useRuntimeConfig();

const { documents: npcsData, total: total_ } = await database.listDocuments(
  config.public.databaseID,
  config.public.npcCollectionID,
  [Query.offset(0), Query.limit(73)]
);
const npcs = ref(npcsData);

  

const saveSupabase = async (data: CharacterDocumentSaveSupabase) => {
  try {
    const { data: response, error } = await supabase
      .from('npcs')
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

for (const npc of npcs.value) {
  const data: CharacterDocumentSaveSupabase = {
    ...npc,
    slug: npc.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-zA-Z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-|-$/g, '') // Trim hyphens from both ends
      .toLowerCase(),
    attr: JSON.parse(npc.attr[0]),
    spells: npc.spells[0] ? JSON.parse(npc.spells[0]) : [],
    items: npc.items[0] ? JSON.parse(npc.items[0]) : [],
    appearance_description: npc.appearance_,
  };
  const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, appearance_, armourClass, class_, hitPoints, hitDice, sexOrientation, savingThrows, secretPlot, image, show, ...filteredData } = data;
  const filteredDataFinal = filteredData;
  console.log('Filtered data:', filteredDataFinal);

  try {
    const response = await saveSupabase(filteredDataFinal);
    console.log('Document saved successfully:', response);
  } catch (error) {
    console.error('Error saving document:', error);
  }
}
</script>

<template>
  <NPCSearchCard :npcs="npcs" />
</template>