<script setup lang="ts">
import defaultImage from '@/assets/images/npc/default_npc.webp';
import type { NpcLocalState, CharacterDocument, CharacterDocumentSaveAppwrite, CharacterDocumentSaveSupabase } from '@/interfaces/npc.type';
import type { SelectOption } from '@/interfaces/common.type';

const supabase = useSupabaseClient();
const { locale } = useNuxtApp().$i18n;
const { database, ID } = useAppwrite();
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const panelCollapsed = ref(false);

const npc = reactive<NpcLocalState>({
  show: false,
  image: defaultImage,
  name: '',
  race: '',
  class_: '',
  job: '',
  armour_class: 0,
  initiative: '',
  speed: '',
  hitPoints: '0',
  hitDice: '',
  description: '',
  appearance: '',
  languages: '',
  savingThrows: '',
  attr: null,
  sexOrientation: '',
  appearance_: '',
  affiliation: '',
  alignment: '',
  background: '',
  backstory: '',
  gender: '',
  goal: '',
  personality: '',
  items: null,
  enemy: false,
  secretPlot: '',
  spells: null,
  difficult: '',
  age: 0,
  level: 1,
  $id: '',
  $createdAt: '',
  $updatedAt: '',
  $permissions: [],
  $databaseId: '',
  $collectionId: '',
});

const { data: age, status: statusAge, error: errorAge, refresh: refreshAge, clear: clearAge } = await useAsyncData(
  'age',
  () => $fetch(`${config.public.url}tables/age.json`)
);
const { data: races, status: statusRaces, error: errorRaces, refresh: refreshRaces, clear: clearRaces } = await useAsyncData(
  'races',
  () => $fetch(`${config.public.url}tables/races.json`)
);
const { data: gender, status: statusGender, error: errorGender, refresh: refreshGender, clear: clearGender } = await useAsyncData(
    'gender',
    () => $fetch(`${config.public.url}tables/gender.json`)
);
const { data: alignments, status: statusAlignments, error: errorAlignments, refresh: refreshAlignments, clear: clearAlignments } = await useAsyncData(
  'alignments',
  () => $fetch(`${config.public.url}tables/alignments.json`)
);
const { data: levels, status: statusLevels, error: errorLevels, refresh: refreshLevels, clear: clearLevels } = await useAsyncData(
  'levels',
  () => $fetch(`${config.public.url}tables/levels.json`)
);
const { data: classesData, status: statusClasses, error: errorClasses, refresh: refreshClasses, clear: clearClasses } = await useAsyncData(
  'classes',
  () => $fetch(`${config.public.url}tables/classes.json`)
);
const { data: jobs, status: statusJobs, error: errorJobs, refresh: refreshJobs, clear: clearJobs } = await useAsyncData(
  'jobs',
  () => $fetch(`${config.public.url}tables/jobs.json`)
);
const { data: backgrounds, status: statusBackgrounds, error: errorBackgrounds, refresh: refreshBackgrounds, clear: clearBackgrounds } = await useAsyncData(
  'backgrounds',
  () => $fetch(`${config.public.url}tables/backgrounds.json`)
);
const { data: sexOrientations, status: statusSexOrientations, error: errorSexOrientations, refresh: refreshSexOrientation, clear: clearSexOrientation } = await useAsyncData(
  'sexOrientation',
  () => $fetch(`${config.public.url}tables/sex_orientations.json`)
);
const { data: appearances, status: statusAppearances, error: errorAppearances, refresh: refreshAppearances, clear: clearAppearances } = await useAsyncData(
  'appearances',
  () => $fetch(`${config.public.url}tables/appearances.json`)
);
const { data: personalities, status: statusPersonalities, error: errorPersonalities, refresh: refreshPersonalities, clear: clearPersonalities } = await useAsyncData(
  'personalities',
  () => $fetch(`${config.public.url}tables/personalities.json`)
);
const { data: affiliations, status: statusAffiliations, error: errorAffiliations, refresh: refreshAffiliations, clear: clearAffiliations } = await useAsyncData(
  'affiliations',
  () => $fetch(`${config.public.url}tables/affiliations.json`)
);
const { data: goals, status: statusGoals, error: errorGoals, refresh: refreshGoals, clear: clearGoals } = await useAsyncData(
  'goals',
  () => $fetch(`${config.public.url}tables/goals.json`)
);
const { data: backstories, status: statusBackstories, error: errorBackstories, refresh: refreshBackstories, clear: clearBackstories } = await useAsyncData(
  'backstories',
  () => $fetch(`${config.public.url}tables/backstories.json`)
);
const { data: difficulty, status: statusDifficulty, error: errorDifficulty, refresh: refreshDifficulty, clear: clearDifficulty } = await useAsyncData(
  'difficulty',
  () => $fetch(`${config.public.url}tables/difficulty.json`)
);
const enemy = ref([
  { label: 'common.no', value: false },
  { label: 'common.yes', value: true }
]);

const initialValues = reactive({
  age: age.value[0],
  race: races.value[0],
  gender: gender.value[0],
  alignment: alignments.value[0],
  level: levels.value[0],
  class_: classesData.value[0],
  job: jobs.value[0],
  background: backgrounds.value[0],
  sex_orientation: sexOrientations.value[0],
  appearance: appearances.value[0],
  personality: personalities.value[0],
  affiliation: affiliations.value[0],
  goal: goals.value[0],
  backstory: backstories.value[0],
  difficult: difficulty.value[0],
  enemy: enemy.value[0],
});

const resolver = ({ values }) => {
  const errors = {};
  const requiredFields = [
    'age', 'race', 'gender', 'alignment', 'level', 'class_', 'job',
    'background', 'sex_orientation', 'appearance', 'personality',
    'affiliation', 'goal', 'backstory', 'difficult',
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = [{ message: `${field} is required.` }];
    }
  });
  return { values, errors };
};

const saveAppwrite = async (data: CharacterDocumentSaveAppwrite) => {
  try {
    const response = await database.createDocument<CharacterDocument>(
      config.public.databaseID,
      config.public.npcCollectionID,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

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

const onFormSubmit = async ({ values, valid }: { values: any, valid: boolean }) => {
  if (!valid) return;

  panelCollapsed.value = true;
  loading.value = true;
  npc.show = true;

  try {
    const formData = new FormData();
    formData.append('generate', 'NPC');
    Object.entries(values).forEach(([key, valueObj]: [string, any]) => {
        let api_key = key;
        // if (key === 'class_') api_key = 'class';
        if (valueObj && typeof valueObj === 'object' && 'value' in valueObj) {
             formData.append(api_key, valueObj.value);
        } else {
             console.warn(`Unexpected value structure for key in onFormSubmit: ${key}`, valueObj);
        }
    });

    const generatedNpcData = await $fetch('/api/core', { method: 'POST', body: formData });

    const dataToSave: CharacterDocumentSaveAppwrite = {
      name: generatedNpcData.name,
      race: generatedNpcData.race,
      class: generatedNpcData.class,
      job: generatedNpcData.job,
      armour_class: parseInt(generatedNpcData.armour_class, 10) || 0,
      initiative: generatedNpcData.initiative,
      speed: generatedNpcData.speed,
      hit_points: String(generatedNpcData.hit_points || 0),
      hit_dice: generatedNpcData.hit_dice,
      description: generatedNpcData.description,
      appearance: generatedNpcData.appearance,
      languages: generatedNpcData.languages,
      saving_throws: generatedNpcData.saving_throws,
      sex_orientation: generatedNpcData.sex_orientation,
      appearance_: generatedNpcData.appearance_,
      affiliation: generatedNpcData.affiliation,
      alignment: generatedNpcData.alignment,
      background: generatedNpcData.background,
      backstory: generatedNpcData.backstory,
      gender: generatedNpcData.gender,
      goal: generatedNpcData.goal,
      personality: generatedNpcData.personality,
      enemy: values.enemy.value,
      secret_plot: generatedNpcData.secret_plot,
      difficult: generatedNpcData.difficult,
      age: parseInt(generatedNpcData.age, 10) || 0,
      level: parseInt(generatedNpcData.level, 10) || 1,
      attr: generatedNpcData.attr ? [JSON.stringify(generatedNpcData.attr)] : ['{}'],
      items: generatedNpcData.items ? [JSON.stringify(generatedNpcData.items)] : ['{}'],
      spells: generatedNpcData.spells ? [JSON.stringify(generatedNpcData.spells)] : ['{}'],
    };

    const response = await saveAppwrite(dataToSave);

     Object.assign(npc, {
         ...generatedNpcData,
         $id: response.$id,
         $createdAt: response.$createdAt,
         $updatedAt: response.$updatedAt,
         $databaseId: response.$databaseId,
         $collectionId: response.$collectionId,
         class: generatedNpcData.class,
         hitPoints: parseInt(generatedNpcData.hit_points, 10) || 0,
         armourClass: parseInt(generatedNpcData.armour_class, 10) || 0,
         age: parseInt(generatedNpcData.age, 10) || 0,
         level: parseInt(generatedNpcData.level, 10) || 1,
         image: defaultImage,
     });

    router.push({
      name: `generate-npc-id___${locale.value}`,
      params: { id: response.$id },
    });

  } catch (error) {
    console.error('Error creating NPC:', error);
  } finally {
    loading.value = false;
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      npc.image = e.target?.result ?? null;
    };
    reader.readAsDataURL(file);
  }
};

const getDocument = async () => {
  const id = route.params.id;
  if (id !== 'new') {
    npc.show = true;
    try {
      const response = await database.getDocument(
        config.public.databaseID,
        config.public.npcCollectionID,
        id
      );
      
      Object.assign(npc, {
        ...response,
        age: parseInt(response.age, 10),
        armourClass: parseInt(response.armour_class, 10),
        class_: response.class,
        level: parseInt(response.level, 10),
        attr: JSON.parse(response.attr[0]),
        items: response.items[0] ? JSON.parse(response.items[0]) : [],
        spells: response.spells[0] ? JSON.parse(response.spells[0]) : [],
        secretPlot: response.secret_plot,
        savingThrows: response.saving_throws,
        sexOrientation: response.sex_orientation,
        hitDice: response.hit_dice,
        hitPoints: response.hit_points,
      });
      panelCollapsed.value = true;
    } catch (error) {
      console.error('Error fetching NPC:', error);
    } finally {
    }
  } else {
    panelCollapsed.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  await getDocument();
  let data: CharacterDocumentSaveSupabase = {
    ...npc,
    armour_class: npc.armourClass,
    hit_dice: npc.hitDice,
    hit_points: npc.hitPoints,
    saving_throws: npc.savingThrows,
    appearance_description: npc.appearance_,
    sex_orientation: npc.sexOrientation,
    secret_plot: npc.secretPlot,
  }
  const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, appearance_, armourClass, class_, hitPoints, hitDice, sexOrientation, savingThrows, secretPlot, image, show, ...filteredData } = data;
  data = filteredData;
  console.log('Filtered data:', data);
  await saveSupabase(data);
  loading.value = false;
});
</script>

<template>
  <NPCForm
    :loading="loading"
    :panelCollapsed="panelCollapsed"
    :age="age"
    :races="races"
    :gender="gender"
    :alignments="alignments"
    :levels="levels"
    :classesData="classesData"
    :jobs="jobs"
    :backgrounds="backgrounds"
    :sexOrientations="sexOrientations"
    :appearances="appearances"
    :personalities="personalities"
    :affiliations="affiliations"
    :goals="goals"
    :backstories="backstories"
    :difficulty="difficulty"
    :enemy="enemy"
    :initialValues="initialValues"
    :resolver="resolver"
    :onFormSubmit="onFormSubmit"
  />

  <NPCCard :npc="npc" :loading="loading" :onFileChange="onFileChange" />
</template>
