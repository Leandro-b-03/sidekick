<script setup lang="ts">
import defaultImage from '@/assets/images/npc/default_npc.webp';
import type { NpcLocalState, CharacterDocument } from '@/interfaces/npc.type';
import type { SelectOption } from '@/interfaces/common.type';
import age from '@/tables/age.json';
import races from '@/tables/races.json';
import gender from '@/tables/gender.json';
import alignments from '@/tables/alignments.json';
import levels from '@/tables/levels.json';
import classesData from '@/tables/classes.json';
import jobs from '@/tables/jobs.json';
import backgrounds from '@/tables/backgrounds.json';
import sexOrientations from '@/tables/sex_orientations.json';
import appearances from '@/tables/appearances.json';
import personalities from '@/tables/personalities.json';
import affiliations from '@/tables/affiliations.json';
import goals from '@/tables/goals.json';
import backstories from '@/tables/backstories.json';
import difficulty from '@/tables/difficulty.json';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const { locale } = useNuxtApp().$i18n;
const t = useNuxtApp().$i18n.t;
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const panelCollapsed = ref(route.params.id !== 'new');

const npc = reactive<NpcLocalState>({
  show: false,
  image: defaultImage,
  slug: '',
  name: '',
  race: '',
  class: '',
  job: '',
  armourClass: 0,
  initiative: '',
  speed: '',
  hitPoints: '0',
  hitDice: '',
  description: '',
  appearance: '',
  languages: '',
  savingThrows: '',
  attr: [],
  sexOrientation: '',
  appearanceDescription: '',
  affiliation: '',
  alignment: '',
  background: '',
  backstory: '',
  gender: '',
  goal: '',
  personality: '',
  items: [],
  enemy: false,
  secretPlot: '',
  spells: [],
  difficult: '',
  age: 0,
  level: 1,
});

const enemy = ref([
  { label: 'common.no', value: false },
  { label: 'common.yes', value: true }
]);

const initialValues = reactive({
  age: age[0],
  race: races[0],
  gender: gender[0],
  alignment: alignments[0],
  level: levels[0],
  class_: classesData[0],
  job: jobs[0],
  background: backgrounds[0],
  sex_orientation: sexOrientations[0],
  appearance: appearances[0],
  personality: personalities[0],
  affiliation: affiliations[0],
  goal: goals[0],
  backstory: backstories[0],
  difficult: difficulty[0],
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

    const dataToSave: CharacterDocument = {
      slug: generateSlug(generatedNpcData.name),
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
      appearance_description: generatedNpcData.appearance_,
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
      attr: generatedNpcData.attr,
      items: generatedNpcData.items,
      spells: generatedNpcData.spells,
    };

    const response = await save(dataToSave, 'npcs', supabase);

    Object.assign(npc, {
      ...generatedNpcData,
      slug: dataToSave.slug,
      class: generatedNpcData.class,
      hitPoints: parseInt(generatedNpcData.hit_points, 10) || 0,
      armourClass: parseInt(generatedNpcData.armour_class, 10) || 0,
      hitDice: generatedNpcData.hit_dice,
      appearanceDescription: generatedNpcData.appearance_,
      age: parseInt(generatedNpcData.age, 10) || 0,
      level: parseInt(generatedNpcData.level, 10) || 1,
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
      name: `generate-npc-id___${locale.value}`,
      params: { id: `${response.id}-${dataToSave.slug}` },
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
  const [id, ...slugParts] = route.params.id.toString().split('-');
  const slug = slugParts.join('-');
  if (id !== 'new') {
    npc.show = true;
    try {
      const { data, error } = await supabase
        .from('npcs')
        .select('*')
        .eq('id', id)
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      const response = data as CharacterDocument;
      const { appearance_description, armour_class, hit_points, hit_dice, sex_orientation, saving_throws, secret_plot, ...filteredNPC } = response;
      
      Object.assign(npc, {
        ...filteredNPC,
        armourClass: response.armour_class,
        secretPlot: response.secret_plot,
        savingThrows: response.saving_throws,
        sexOrientation: response.sex_orientation,
        hitDice: response.hit_dice,
        hitPoints: response.hit_points,
        appearanceDescription: response.appearance_description,
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

onMounted(async () => {;
  await getDocument();
  loading.value = false;

  let title = `${t('generate.npcs.create')} - ${t('sidekick')}`;

  if (route.params.id !== 'new') {
    title = `${npc.name} - ${t('sidekick')}`;
  }

  useSeoMeta({
    title: title,
  });
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
