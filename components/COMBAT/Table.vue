<script setup lang="ts">
import type { Combatant, MonsterInfo } from '~/interfaces/combat.type';

// Define function prop types explicitly for clarity and safety
type CellEditCompleteFn = (event: any) => Promise<void>;
type AddPlayerFn = () => Promise<void>;
type AdvanceTurnFn = () => Promise<void>;
type SaveCombatFn = () => Promise<void>;
type ResetCombatFn = () => Promise<void>;
type RemoveCombatantFn = (combatant: Combatant) => void;

// --- Props Definition ---
const props = defineProps({
  combatants: {
    type: Array as PropType<Combatant[]>,
    required: true,
    // default: () => [] // Default might be okay if component handles empty state
  },
  loading: {
    type: Boolean,
    default: false,
  },
  onCellEditComplete: {
    type: Function as PropType<CellEditCompleteFn>,
    required: true,
  },
  addPlayer: {
    type: Function as PropType<AddPlayerFn>,
    required: true,
  },
  advanceTurn: {
    type: Function as PropType<AdvanceTurnFn>,
    required: true,
  },
  saveCombat: {
    type: Function as PropType<SaveCombatFn>,
    required: true,
  },
  resetCombat: {
    type: Function as PropType<ResetCombatFn>,
    required: true,
  },
  removeCombatant: {
    type: Function as PropType<RemoveCombatantFn>,
    required: true,
  },
});

const visible = ref(false);
const monster = ref<MonsterInfo | null>(null);
const currentTurnNumber = ref<number>(0);

const updateTurnNumber = (currentCombatants: Combatant[]) => {
  if (!currentCombatants || currentCombatants.length === 0) {
    currentTurnNumber.value = 0;
  } else {
    currentTurnNumber.value = currentCombatants[0].turnHistory.length;
  }
};

onMounted(() => {
  updateTurnNumber(props.combatants);
});

watch(() => props.combatants, (newCombatants) => {
  console.log("Combatants prop changed in child");
  updateTurnNumber(newCombatants);
}, { deep: true });

const openDialog = (data: any) => {
  visible.value = true;
  monster.value = data;
  console.log(data);
};
</script>

<template>
  <div class="bg-white dark:bg-gray-900 shadow rounded mt-4 overflow-hidden">
    <DataTable :value="combatants" editMode="cell" @cell-edit-complete="onCellEditComplete" scrollable class="w-full max-h-[800px]" scrollHeight="800px">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <Button icon="pi pi-user" :label="$t('combat.add_player')" severity="success" @click="addPlayer" />
          <Button icon="pi pi-plus" :label="$t('combat.add_turn')" severity="secondary" @click="advanceTurn" />
        </div>
      </template>
      <Column field="order" style="width: 5%" header="#" frozen>
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>
      <Column field="name" :header="$t('common.name')" style="width: 10%;" frozen>
        <template #editor="{ data, field }">
          <InputText v-if="data.type == 'player'" v-model="data[field]" autofocus class="w-[300px]" />
          <template v-else>{{ $t(data.name) }}</template>
        </template>
        <template #body="{ data }">
          {{ $t(data.name) }}
        </template>
      </Column>
      <Column style="width: 4%;">
        <template #body="{ data }">
          <Button icon="pi pi-times" severity="danger" @click="removeCombatant(data)" size="small" class="mr-2" />
          <Button v-if="data.type === 'monster'" icon="pi pi-eye" severity="info" @click="openDialog(data)" size="small" />
        </template>
      </Column>
      <Column field="initiative" :header="$t('common.initiative')" style="width: 5%;">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="number" max="20" min="1" autofocus class="w-[75px]" />
        </template>
      </Column>
      <Column field="maxHp" style="width: 5%;">
        <template #header>
          <span class="font-semibold" v-tooltip.top="$t('common.max-hp')">{{ $t('common.max-hp-abvr') }}</span>
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="number" max="999" min="0" autofocus class="w-[75px]" />
        </template>
        <template #body="{ data }">
          {{ $t(data.maxHp) }}
        </template>
      </Column>
      <Column field="currentHp" style="width: 5%;">
        <template #header>
          <span class="font-semibold" v-tooltip.top="$t('common.current-hp')">{{ $t('common.current-hp-abvr') }}</span>
        </template>
        <template #body="{ data }">
          {{ $t(data.currentHp) }}
        </template>
      </Column>
      <Column field="status" :header="$t('common.status')" style="width: 5%;">
        <template #body="{ data }">
          <Tag :severity="data.status === 'alive' ? 'success' : 'danger'" :value="$t(data.status)"></Tag>
        </template>
      </Column>
      <Column v-for="(col, index) in currentTurnNumber" field="id" :key="index" :header="`${$t('common.turn')} ${index + 1}`" style="width: 5%;">
        <template #editor="{ data, field }">
          <InputText v-if="data.turnHistory[index] !== 'not_in_combat'" v-model="data.turnHistory[index].hp" type="number" max="999" min="0" autofocus class="w-[75px]" />
          <template v-else>{{ $t('combat.not_in_combat') }}</template>
        </template>
        <template #body="{ data }">
          <template v-if="data.turnHistory[index] !== 'not_in_combat'">{{ data.turnHistory[index].hp }}</template>
          <template v-else>
            <span v-tooltip.top="$t('combat.not_in_combat')">{{ $t('combat.not_in_combat_abvr') }}</span>
          </template>
        </template>
      </Column>
    </DataTable>
    <div class="flex flex-row justify-between items-center my-4 mx-2">
      <Button icon="pi pi-save" :label="$t('combat.save_combat')" severity="primary" @click="saveCombat" />
      <Button icon="pi pi-refresh" :label="$t('combat.reset_combat')" severity="danger" @click="resetCombat" />
    </div>
  </div>

  <Dialog v-model:visible="visible" modal header="Show monster" :style="{ width: '800px', height: '800px' }">
    <iframe :src="`https://www.aidedd.org/monster/${monster?.name.replace('monsters.', '')}`" width="100%" height="600px" frameborder="0"></iframe>
    <span>{{ $t('common.credits') }}</span>
    <NuxtLink to="https://www.aidedd.org/monster/" target="_blank">{{ `https://www.aidedd.org/monster/` }}</NuxtLink>
  </Dialog>
</template>