<script setup lang="ts">
import { COMBATANT_STATUS } from '@/interfaces/combat.type';
import type { CombatantDocument, CombatDocument, CombatantLocalState } from '@/interfaces/combat.type';

const route = useRoute();
const router = useRouter();
const t = useNuxtApp().$i18n.t;
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const { locale } = useNuxtApp().$i18n;
const supabase = useSupabaseClient();

const MAX_INITIATIVE = 20;
const DEFAULT_HP = 50;
const loading = ref(false);
const panelColapsed = ref(false);
const combatId = ref(route.params.id);
const combatants = ref<CombatantDocument[]>([]);

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

const addCombatant = (combatantData: CombatantLocalState) => {
  const initialHp = combatantData.maxHp;
  const newCombatant: CombatantLocalState = {
    ...combatantData,
    combatantId: generateUniqueId(),
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

const removeCombatant = (combatant: CombatantDocument) => {
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

    case 'maxHp':
      const newMaxHp = Number(newValue);
      if (!isNaN(newMaxHp) && newMaxHp >= 0 && newMaxHp <= 999) {
        data.maxHp = newMaxHp;
        data.currentHp = Math.min(data.currentHp, newMaxHp); // Ensure current HP does not exceed max HP
        if (data.turnHistory.length === 1) {
          data.turnHistory[0].hp = newMaxHp;
        }
      } else {
        console.warn(`Invalid max HP value: ${newValue}`);
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

const getDocument = async () => {
  const id = route.params.id;
  if (id !== 'new') {
    try {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .eq('combat_id', id);

      if (error) {
        throw error;
      }

      const response = data as CombatantDocument[];
      
      response.map(combatant => {
        const { current_hp, max_hp, turn_history, ...filteredCombat } = combatant;
        combatants.value.push({
          ...filteredCombat,
          currentHp: current_hp,
          maxHp: max_hp,
          turnHistory: turn_history.map(entry => ({
            hp: entry.hp
          })),
        });
      });
    } catch (error) {
      console.error('Error fetching Item:', error);
    } finally {
    }
  } else {
    panelCollapsed.value = false;
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
  if (combatants.value.length === 0) {
    $toast.add({ severity: 'warn', summary: t('combat.messages.no-combatants'), detail: t('combat.messages.no-combatants-detail'), life: 3000 });
    return;
  }

  try {
    loading.value = true;

    const monsters = combatants.value.map(c => c.type === 'monster' && c.status === COMBATANT_STATUS.ALIVE ? c : null).filter(c => c !== null).length;
    const players = combatants.value.map(c => c.type === 'player' && c.status === COMBATANT_STATUS.ALIVE ? c : null).filter(c => c !== null).length;
    const combatStatus = monsters > 0 && players > 0 ? 'ongoing' : 'completed';
    const won = monsters > 0 && players > 0 ? 'none' : players === 0 ? 'monsters' : 'players';

    const combatData: CombatDocument = {
      monsters: combatants.value.map(c => c.type === 'monster' ? c : null).filter(c => c !== null).length,
      players: combatants.value.map(c => c.type === 'player' ? c : null).filter(c => c !== null).length,
      turns: combatants.value[0].turnHistory.length,
      status: combatStatus,
      won: won,
    };
    if (combatId.value !== 'new') {
      combatData.id = combatId.value;
    }

    const { data, error } = await supabase
      .from('combats')
      .upsert(combatData, { onConflict: ['id'] })
      .select();
    if (error) {
      console.error('Error saving combat:', error);
      $toast.add({ severity: 'error', summary: t('combat.messages.error-saving'), detail: t('combat.messages.error-saving-detail'), life: 3000 });
      return;
    }
    if (data) {
      console.log('Combat saved:', data);
      combatId.value = data[0].id;
    }

    const { error: deleteError } = await supabase
      .from('initiatives')
      .delete()
      .eq('combat_id', combatId.value);

    if (deleteError) {
      console.error('Error deleting combatants:', deleteError);
      $toast.add({ severity: 'error', summary: t('combat.messages.error-deleting'), detail: t('combat.messages.error-deleting-detail'), life: 3000 });
      return;
    }

    const combatantsToSave: CombatantDocument[] = combatants.value.map(combatant => ({
      combat_id: combatId.value,
      name: combatant.name,
      initiative: combatant.initiative,
      max_hp: combatant.maxHp,
      current_hp: combatant.currentHp,
      status: combatant.status,
      type: combatant.type,
      turn_history: combatant.turnHistory,
      combatant_id: combatant.combatantId
    }));

    for (const combatant of combatantsToSave) {
      try {
        const { data: combatantData, error: combatantError } = await supabase
          .from('initiatives')
          .upsert(combatant, { onConflict: ['id'] })
          .select();
        if (combatantError) {
          console.error('Error saving combatants:', combatantError);
          continue;
        }
        if (combatantData) {
          combatant.id = combatantData[0].id;
          console.log('combatant', combatant);
        }
      } catch (error) {
        console.error('Error saving combatant:', error);
      }
    }
    

    // Clear local storage after saving
    localStorage.removeItem('combatants');
    $toast.add({ severity: 'success', summary: t('combat.messages.saved'), detail: t('combat.messages.saved-detail'), life: 3000 });

    router.push({
      name: `combat-id___${locale.value}`,
      params: { id: combatId.value },
    });
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
    await getDocument();
  }
});
</script>

<template>
  <COMBATForm :monsters="monsters" :initialValues="initialValues" :resolver="resolver" :onFormSubmit="onFormSubmit" :loading="loading" :panelColapsed="panelColapsed" />

  <COMBATTable :combatants="combatants" :loading="loading" :addPlayer="addPlayer" :onCellEditComplete="onCellEditComplete" :advanceTurn="advanceTurn" :saveCombat="saveCombat" :resetCombat="resetCombat" :removeCombatant="removeCombatant" />
</template>