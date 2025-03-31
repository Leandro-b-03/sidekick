<script setup lang="ts">
import defaultImage from '@/assets/images/items/default.webp';
import type { MagicItemLocalState, MagicItemDocument } from '@/interfaces/npc.inteface';

const { locale } = useNuxtApp().$i18n;
const { database, ID } = useAppwrite();
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

const panelCollapsed = ref(false);
const loading = ref(false);
const item = reactive<MagicItemLocalState>({
  show: false,
  name: '',
  class: null,
  description: '',
  weaponType: null,
  requirements: '',
  type: '',
  wondrousItem: null,
  rarity: '',
  evolutionLevel: [
    {
      level: 1,
      player_level: '',
      bonus: {},
      appearance: '',
      evolution_requirement: ''
    },
    {
      level: 2,
      player_level: '',
      bonus: {},
      appearance: '',
      evolution_requirement: ''
    },
    {
      level: 3,
      player_level: '',
      bonus: {},
      appearance: '',
      evolution_requirement: ''
    },
    {
      level: 4,
      player_level: '',
      bonus: {},
      appearance: '',
      evolution_requirement: ''
    },
    {
      level: 5,
      player_level: '',
      bonus: {},
      appearance: '',
      evolution_requirement: ''
    }
  ],
  notes: [],
  evolutionNotes: [],
  damage: {
    base: '',
    versatile: ''
  },
  itemTier: null,
  damageType: null,
  $id: '',
  $createdAt: '',
  $updatedAt: '',
  $permissions: [],
  $databaseId: '',
  $collectionId: '',
  image: defaultImage,
});

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

const resolver = ({ values }: { values: any }) => {
  const errors: Record<string, { message: string }[]> = {};
  // Use consistent names matching initialValues/form fields
  const requiredFields = ['type', 'class', 'rarity', 'damage_type']; // Adjusted names?
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = [{ message: `${field} is required.` }];
    }
  });
  return { values, errors };
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      item.image = e.target?.result ?? null; // Assign result to local state
    };
    reader.readAsDataURL(file);
  }
};

const onFormSubmit = async ({ values, valid }: { values: any, valid: boolean }) => {
  if (!valid) return;

  panelCollapsed.value = true;
  loading.value = true;
  item.show = true; // Indicate processing/showing result
  item.image = '';

  try {
    const formData = new FormData();
    formData.append('generate', 'ITEM');
    Object.entries(values).forEach(([key, valueObj]: [string, any]) => {
        let api_key = key;
        if (key === 'class_') api_key = 'class';
        if (valueObj && typeof valueObj === 'object' && 'value' in valueObj) {
          formData.append(api_key, valueObj.value);
        } else {
          console.warn(`Unexpected value structure for key: ${key}`, valueObj);
        }

    });

    const generatedItemData = await $fetch('/api/core', { method: 'POST', body: formData });

    const dataToSave: MagicItemDocument = {
      name: generatedItemData.name,
      class: generatedItemData.class, // Use consistent names
      description: generatedItemData.description,
      type: generatedItemData.type,
      damage: [JSON.stringify(generatedItemData.damage)], // Stringify object
      damage_type: generatedItemData.damage_type,
      requirements: generatedItemData.requirements,
      wondrous_item: generatedItemData.wondrous_item, // Use consistent names
      rarity: generatedItemData.rarity,
      item_tier: generatedItemData.item_tier,
      weapon_type: generatedItemData.weapon_type, // Use consistent names
      evolution_level: [JSON.stringify(generatedItemData.evolution_level)], // Stringify array of objects
      notes: generatedItemData.notes,
      evolution_notes: generatedItemData.evolution_notes, // Use consistent names
    };

    const response = await database.createDocument(
      config.public.databaseID,
      config.public.itemsCollectionID,
      ID.unique(),
      dataToSave
    );

     Object.assign(item, {
         ...dataToSave,
         $id: response.$id,
         $createdAt: response.$createdAt,
         $updatedAt: response.$updatedAt,
         evolution_level: generatedItemData.evolution_level,
         damage: generatedItemData.damage,
         image: defaultImage,
     });

    router.push({
      name: `generate-item-id___${locale.value}`,
      params: { id: response.$id },
    });

  } catch (error) {
    console.error('Error creating ITEM:', error);
  } finally {
    loading.value = false;
  }
};

const getDocument = async () => {
  const id = route.params.id;
  if (id && id !== 'new') {
    item.show = true;
    loading.value = true;
    panelCollapsed.value = true;
    try {
      // Fetch the document - Cast the result for better type safety
      const doc = await database.getDocument(
        config.public.databaseID,
        config.public.itemsCollectionID,
        id
      ) as unknown as MagicItemDocument; // Use intersection type

      // --- Update local state ---
      Object.assign(item, {
        ...doc, // Spread basic fields + Appwrite metadata ($id, $createdAt etc.)
        show: true, // Ensure show is true
        // Parse stringified fields back into objects/arrays for local state
        damage: JSON.parse(doc.damage[0] || '{}'), // Add fallback for safety
        evolution_level: JSON.parse(doc.evolution_level[0] || '[]'), // Add fallback
        image: defaultImage, // TODO: Load actual image if stored/available
        // Ensure any name mappings are done here if needed (e.g. class vs class_)
      });

    } catch (error) {
      console.error('Error fetching Item:', error);
      // TODO: Handle error (e.g., show not found message, redirect)
      router.push('/error'); // Example redirect
    } finally {
    }
  } else {
    // Reset item state for 'new' case? Panel state handled.
     panelCollapsed.value = false; // Ensure panel is open for new items
  }
}

onMounted(async () => {
  loading.value = true
  await getDocument();
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

  <ITEMCard :item="item" :loading="loading" :onFileChange="onFileChange" />
</template>