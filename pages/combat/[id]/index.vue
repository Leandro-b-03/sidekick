<script setup lang="ts">
import { COMBATANT_STATUS } from '~/interfaces/combat.type';
import type { Combatant } from '~/interfaces/combat.type';

const route = useRoute();
const router = useRouter();
const t = useNuxtApp().$i18n.t;
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const { locale } = useNuxtApp().$i18n;
const { database, Query, ID } = useAppwrite();

const MAX_INITIATIVE = 20;
const DEFAULT_HP = 50;
const loading = ref(false);
const panelColapsed = ref(false);
const combatId = ref(route.params.id);
const combatants = ref<Combatant[]>([]);

console.log('Combat ID:', combatId.value);

if (import.meta.client) {
  const storedCombatants = localStorage.getItem('combatants');
  if (storedCombatants && storedCombatants !== 'null' && storedCombatants !== 'undefined' && storedCombatants !== '') {
    combatants.value = JSON.parse(storedCombatants);
  }
}

const { data: monsters, status: statusMonsters, error: errorMonsters, refresh: refreshMonsters, clear: clearMonsters } = await useAsyncData(
  'monsters',
  () => $fetch(`${config.public.url}tables/monsters.json`)
);

const initialValues = reactive({
  monster: monsters.value[0]
});

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

const saveLocalStorage = () => {
  window.localStorage.setItem('combatants', JSON.stringify(combatants.value));
}

const generateUniqueId = (): string => `combatant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const addCombatant = (combatantData: Omit<Combatant, 'id' | 'turnHistory' | 'currentHp'>) => {
  const initialHp = combatantData.maxHp;
  const newCombatant: Combatant = {
    ...combatantData,
    id: generateUniqueId(),
    currentHp: initialHp,
    // turnHistory: [{ hp: initialHp }],    
    turnHistory: combatants.value[0]
      ? combatants.value[0].turnHistory.map((entry, index) =>
          index === combatants.value[0].turnHistory.length - 1
            ? { hp: initialHp }
            : 'not_in_combat'
        )
      : [{ hp: initialHp }],

  };
  combatants.value.push(newCombatant);

  saveLocalStorage();
};

const sortCombatants = () => {
  combatants.value.sort((a, b) => b.initiative - a.initiative);
};

const removeCombatant = (combatant: Combatant) => {
  combatants.value = combatants.value.filter(c => c.id !== combatant.id);
  saveLocalStorage();
};

const onFormSubmit = async ({ values, valid }: { values: typeof initialValues.value, valid: boolean }) => {
  if (!valid || !values.monster) {
    console.warn('Form is invalid or monster not selected');
    return;
  }

  loading.value = true;

  const selectedMonster = values.monster;
  const monsterHp = selectedMonster.hp ?? DEFAULT_HP;

  for (let i = 0; i < values.monster_qtd; i++) {
    addCombatant({
      name: selectedMonster.label,
      initiative: Math.floor(Math.random() * MAX_INITIATIVE) + 1,
      maxHp: monsterHp,
      status: COMBATANT_STATUS.ALIVE,
      type: 'monster',
      monsterData: selectedMonster
    });
  }

  sortCombatants();
  saveLocalStorage();
  loading.value = false;
};

const addPlayer = async () => {
  loading.value = true;
  // showCombatPanel.value = true; // Ensure panel is visible

  const playerName = `Player ${combatants.value.filter(c => c.type === 'player').length + 1}`;
  const playerHp = 50; // Example: Prompt user or get from character sheet data
  const playerInitiative = 0; // Example: Prompt user

  addCombatant({
      name: playerName,
      initiative: playerInitiative,
      maxHp: playerHp,
      status: COMBATANT_STATUS.ALIVE,
      type: 'player',
  });

  sortCombatants();
  saveLocalStorage();
  loading.value = false;
};

const advanceTurn = async () => {
  if (combatants.value.length === 0) {
    $toast.add({ severity: 'warn', summary: t('combat.messages.no-combatants'), detail: t('combat.messages.no-combatants-detail'), life: 3000 });
    return;
  }

  loading.value = true;
  combatants.value.forEach(combatant => {
    combatant.turnHistory.push({
        hp: combatant.currentHp,
    });
  });

  saveLocalStorage();
  loading.value = false;
};

const onCellEditComplete = (event: any) => {
  let { data, newValue, field } = event;

  if (!data || typeof data !== 'object') return;

  loading.value = true;

  switch (field) {
    case 'initiative':
      const newInitiative = Number(newValue);
      if (!isNaN(newInitiative) && newInitiative >= 0 && newInitiative <= MAX_INITIATIVE + 10) {
        data.initiative = newInitiative;
        sortCombatants();
      } else {
        console.warn(`Invalid initiative value: ${newValue}`);
        // Optionally provide feedback to the user
        // event.preventDefault(); // Consider if prevention is needed based on component behavior
      }
      break;

    case 'name':
      const newName = String(newValue).trim();
      if (newName.length > 0) {
        data.name = newName;
      } else {
        console.warn("Name cannot be empty");
        // event.preventDefault();
      }
      break;

      case 'id':
        combatants.value = combatants.value.map(combatant => {
          if (combatant.id === data.id) {
            const lastTurn = combatant.turnHistory[combatant.turnHistory.length - 1];
            combatant.currentHp = parseInt(lastTurn?.hp, 10) ?? parseInt(combatant.currentHp, 10);
            combatant.status = combatant.currentHp > 0 ? COMBATANT_STATUS.ALIVE : COMBATANT_STATUS.DEAD;
          }
          return combatant;
        });
        break;

    default:
      console.log(`Attempted to edit unhandled field: ${field}`);
      break;
  }

  saveLocalStorage();
  loading.value = false;
};

const getCombat = async () => {
  console.log('Fetching combat for ID:', combatId.value);
  try {
    loading.value = true;
    const response = await database.listDocuments(
      config.public.databaseID,
      config.public.initiativeCollectionID,
      [Query.equal('combat_id', combatId.value)]
    );

    if (response.documents.length > 0) {
      combatants.value = response.documents.map((doc: any) => ({
        id: doc.id,
        currentHp: doc.current_hp,
        initiative: doc.initiative,
        maxHp: doc.max_hp,
        name: doc.name,
        status: doc.status,
        turnHistory: JSON.parse(doc.turn_history[0]),
        type: doc.type,
        docId: doc.$id,
      }));

      sortCombatants();
    } else {
      console.warn('No combat found for the given ID');
    }
  } catch (error) {
    console.error('Error fetching combat:', error);
  } finally {
    loading.value = false;
  }
};

const resetCombat = async () => {
  loading.value = true;
  combatants.value.map(combatant => {
    combatant.currentHp = combatant.maxHp;
    combatant.status = COMBATANT_STATUS.ALIVE;
    combatant.turnHistory = [{ hp: combatant.maxHp }];
  });
  saveLocalStorage();
  loading.value = false;
};

const saveCombat = async () => {
  try {
    loading.value = true;

    let combatId_ = ID.unique();

    if (combatId.value === 'new') {
      combatants.value.map(async combatant => {
        await database.createDocument(
          config.public.databaseID,
          config.public.initiativeCollectionID,
          ID.unique(),
          {
            current_hp: parseInt(combatant.currentHp),
            id: combatant.id,
            initiative: combatant.initiative,
            max_hp: combatant.maxHp,
            name: combatant.name,
            status: combatant.status,
            turn_history: [JSON.stringify(combatant.turnHistory)],
            type: combatant.type,
            combat_id: combatId_,
          }
        );
      });

      // Clear local storage after saving
      localStorage.removeItem('combatants');
      $toast.add({ severity: 'success', summary: t('combat.messages.saved'), detail: t('combat.messages.saved-detail'), life: 3000 });

      router.push({
        name: `combat-id___${locale.value}`,
        params: { id: combatId_ },
      });
    } else {
      combatants.value.map(async combatant => {
        await database.updateDocument(
          config.public.databaseID,
          config.public.initiativeCollectionID,
          combatant.docId,
          {
            current_hp: parseInt(combatant.currentHp),
            initiative: combatant.initiative,
            max_hp: combatant.maxHp,
            name: combatant.name,
            status: combatant.status,
            turn_history: [JSON.stringify(combatant.turnHistory)],
            type: combatant.type,
          }
        );
      });

      // Clear local storage after saving
      $toast.add({ severity: 'success', summary: t('combat.messages.saved'), detail: t('combat.messages.saved-detail'), life: 3000 });
    }

    const monsters = combatants.value.map(c => c.type === 'monster' && c.status === COMBATANT_STATUS.ALIVE ? c : null).filter(c => c !== null).length;
    const players = combatants.value.map(c => c.type === 'player' && c.status === COMBATANT_STATUS.ALIVE ? c : null).filter(c => c !== null).length;
    const combatStatus = monsters > 0 && players > 0 ? 'in_progress' : 'finished';
    const won = monsters > 0 ? 'monsters' : players > 0 ? 'players' : 'none';

    const response = await database.createDocument(
      config.public.databaseID,
      config.public.combatsCollectionID,
      ID.unique(),
      {
        combat_id: combatId_,
        monsters: combatants.value.map(c => c.type === 'monster' ? c : null).filter(c => c !== null).length,
        players: combatants.value.map(c => c.type === 'player' ? c : null).filter(c => c !== null).length,
        turns: combatants.value[0].turnHistory.length,
        status: combatStatus,
        won: won,
      }
    );

    console.log('Combat saved:', response);
  } catch (error) {
    console.error('Error saving combat:', error);
    $toast.add({ severity: 'error', summary: t('combat.messages.error-saving'), detail: t('combat.messages.error-saving-detail'), life: 3000 });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (import.meta.client) {
    if (route.params.reset === 'true') {
      localStorage.removeItem('combatants');
    }
  }

  if (route.params.id !== 'new') {
    await getCombat();
  }
});
</script>

<template>
  <COMBATForm :monsters="monsters" :initialValues="initialValues" :resolver="resolver" :onFormSubmit="onFormSubmit" :loading="loading" :panelColapsed="panelColapsed" />

  <COMBATTable :combatants="combatants" :loading="loading" :addPlayer="addPlayer" :onCellEditComplete="onCellEditComplete" :advanceTurn="advanceTurn" :saveCombat="saveCombat" :resetCombat="resetCombat" :removeCombatant="removeCombatant" />
</template>