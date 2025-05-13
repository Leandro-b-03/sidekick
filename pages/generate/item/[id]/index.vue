<script setup lang="ts">
import defaultImage from '@/assets/images/items/default.webp';
import type { MagicItemLocalState, MagicItemDocument } from '@/interfaces/item.type';
import type { SelectOption } from '@/interfaces/common.type';

const { locale } = useNuxtApp().$i18n;
const t = useNuxtApp().$i18n.t;
const supabase = useSupabaseClient();
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();

const panelCollapsed = ref(route.params.id !== 'new');
const loading = ref(true);
const item = reactive<MagicItemLocalState>({
  show: false,
  name: '',
  class: null,
  description: '',
  weaponType: '',
  requirements: '',
  type: '',
  wondrousItem: '',
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
  itemTier: '',
  damageType: '',
  image: defaultImage,
});

const { data: classesData, status: statusClasses, error: errorClasses, refresh: refreshClasses, clear: clearClasses } = await useAsyncData<SelectOption[]>(
  'classes',
  () => $fetch(`${config.public.url}tables/classes.json`)
);
const { data: damages, status: statusDamages, error: errorDamages, refresh: refreshDamages, clear: clearDamages } = await useAsyncData<SelectOption[]>(
  'damages',
  () => $fetch(`${config.public.url}tables/damage_type.json`)
);
const { data: types, status: statusTypes, error: errorTypes, refresh: refreshTypes, clear: clearTypes } = await useAsyncData<SelectOption[]>(
  'types',
  () => $fetch(`${config.public.url}tables/types.json`)
);
const { data: wondrousItems, status: statusWondrousItems, error: errorWondrousItems, refresh: refreshWondrousItems, clear: clearWondrousItems } = await useAsyncData<SelectOption[]>(
  'wondrousItems',
  () => $fetch(`${config.public.url}tables/wondrous_items.json`)
);
const { data: rarities, status: statusRarities, error: errorRarities, refresh: refreshRarities, clear: clearRarities } = await useAsyncData<SelectOption[]>(
  'rarities',
  () => $fetch(`${config.public.url}tables/rarities.json`)
);
const { data: weapons, status: statusWeapons, error: errorWeapons, refresh: refreshWeapons, clear: clearWeapons } = await useAsyncData<SelectOption[]>(
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
        // if (key === 'class_') api_key = 'class';
        if (valueObj && typeof valueObj === 'object' && 'value' in valueObj) {
          formData.append(api_key, valueObj.value);
        } else {
          console.warn(`Unexpected value structure for key: ${key}`, valueObj);
        }

    });

    const generatedItemData = await $fetch('/api/core', { method: 'POST', body: formData });

    const dataToSave: MagicItemDocument = {
      slug: generateSlug(generatedItemData.name),
      name: generatedItemData.name,
      class: generatedItemData.class, // Use consistent names
      description: generatedItemData.description,
      type: generatedItemData.type,
      damage: generatedItemData.damage, // Stringify object
      damage_type: generatedItemData.damage_type,
      requirements: generatedItemData.requirements,
      wondrous_item: generatedItemData.wondrous_item, // Use consistent names
      rarity: generatedItemData.rarity,
      item_tier: generatedItemData.item_tier,
      weapon_type: generatedItemData.weapon_type, // Use consistent names
      evolution_level: generatedItemData.evolution_levels, // Stringify array of objects
      notes: generatedItemData.notes,
      evolution_notes: generatedItemData.evolution_notes, // Use consistent names
    };

    const response = await save(dataToSave, 'items', supabase);

     Object.assign(item, {
        ...dataToSave,
        evolutionLevel: response.evolution_level,
        wondrousItem: response.wondrous_item,
        itemTier: response.item_tier,
        weaponType: response.weapon_type,
        evolutionNotes: response.evolution_notes,
        damageType: response.damage_type,
        image: defaultImage,
     });

    if (user.value) {
      const userNPC = {
        user_id: user.value.id,
        npc_id: response.id,
      };

      console.log('User NPC:', userNPC);

      await save(userNPC, 'user_npc', supabase)
        .then(() => {
          console.log('User NPC saved successfully');
        })
        .catch((error) => {
          console.error('Error saving user NPC:', error);
        });
    }

    router.push({
      name: `generate-item-id___${locale.value}`,
      params: { id: `${response.id}-${dataToSave.slug}` },
    });

  } catch (error) {
    console.error('Error creating ITEM:', error);
  } finally {
    loading.value = false;
  }
};

const getDocument = async () => {
  const [id, ...slugParts] = route.params.id.toString().split('-');
  const slug = slugParts.join('-');
  if (id !== 'new') {
    item.show = true;
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      const response = data as MagicItemDocument;
      const { evolution_level, wondrous_item, item_tier, weapon_type, evolution_notes, damage_type, ...filteredItem } = response;
      
      Object.assign(item, {
        ...filteredItem,
        evolutionLevel: response.evolution_level,
        wondrousItem: response.wondrous_item,
        itemTier: response.item_tier,
        weaponType: response.weapon_type,
        evolutionNotes: response.evolution_notes,
        damageType: response.damage_type
      });
      panelCollapsed.value = true;
    } catch (error) {
      console.error('Error fetching Item:', error);
    } finally {
    }
  } else {
    panelCollapsed.value = false;
  }
}

onMounted(async () => {;
  await getDocument();
  loading.value = false;

  let title = `${t('generate.items.create')} - ${t('sidekick')}`;
  
  if (route.params.id !== 'new') {
    title = `${item.name} - ${t('sidekick')}`;
  }

  useSeoMeta({
    title: title,
  });
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