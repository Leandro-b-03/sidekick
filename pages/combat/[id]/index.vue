<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { locale } = useNuxtApp().$i18n;
const { database, ID } = useAppwrite();

const loading = ref(false);
const panelColapsed = ref(false);
const combatId = ref(route.params.id);
const combat = ref<{
  show: boolean;
  data: any[];
}>({
  show: false,
  data: []
});

const { data: monsters, status: statusMonsters, error: errorMonsters, refresh: refreshMonsters, clear: clearMonsters } = await useAsyncData(
  'monsters',
  () => $fetch(`${config.public.url}tables/monsters.json`)
);

const initialValues = {
  monster: monsters.value[0]
}

const resolver = ({ values }) => {
  const errors = {};
  const requiredFields = [
    'monster'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = [{ message: `${field} is required.` }];
    }
  });
  return { values, errors };
};

const onFormSubmit = async ({ values, valid }) => {
  if (!valid) {
    console.log('Form is invalid');
    return;
  }

  loading.value = true;
  combat.value.show = true;

  for (let i = 0; i < values.monster_qtd; i++) {
    combat.value.data = [...combat.value.data, {
      name: values.monster.label,
      initiative: Math.floor(Math.random() * 20),
      hp: 999,
      status: 'alive',
      type: 'monster',
      turn: combat.value.data[0]?.turn ? combat.value.data[0].turn.map((index: number) => index === (combat.value.data[0].turn.length - 1) || combat.value.data[0].turn.length === 1 ? {
        hp: 999,
      } : 'not_in_combat') : [],
    }];
  }

  combat.value.data.sort((a, b) => {
    if (a.initiative > b.initiative) return -1;
    if (a.initiative < b.initiative) return 1;
    return 0;
  });

  loading.value = false;
};

const addPlayer = async () => {
  loading.value = true;
  combat.value.data = [...combat.value.data, {
    name: 'Player',
    initiative: 0,
    hp: 999,
    status: 'alive',
    type: 'player',
    turn: combat.value.data[0]?.turn ? combat.value.data[0].turn.map((index: number) => index === (combat.value.data[0].turn.length - 1) || combat.value.data[0].turn.length === 1 ? {
      hp: 999,
    } : 'not_in_combat') : [],
  }];

  loading.value = false;
};

const addTurn = async () => {
  loading.value = true;
  combat.value.data.forEach((item, index) => {
    combat.value.data[index].turn.push({
      hp: combat.value.data[index].turn[combat.value.data[index].turn.length -1]?.hp || 999,
    })
  });

  loading.value = false;
  console.log(combat.value.data);
};

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;

  switch (field) {
    case 'initiative':
      if (newValue > 0 && newValue <= 20) data[field] = newValue;
      else event.preventDefault();

      combat.value.data.sort((a, b) => {
        if (a.initiative > b.initiative) return -1;
        if (a.initiative < b.initiative) return 1;
        return 0;
      });
      break;

    default:
      if (newValue.trim().length > 0) data[field] = newValue;
      else event.preventDefault();
      break;
  }
};
</script>

<template>
  <COMBATForm :monsters="monsters" :initialValues="initialValues" :resolver="resolver" :onFormSubmit="onFormSubmit" :loading="loading" :panelColapsed="panelColapsed" />

  <COMBATTable :combat="combat" :loading="loading" :addPlayer="addPlayer" :onCellEditComplete="onCellEditComplete" :addTurn="addTurn" />
</template>