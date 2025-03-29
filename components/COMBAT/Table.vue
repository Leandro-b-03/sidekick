<script setup lang="ts">
import { on } from '@primeuix/themes/aura/floatlabel';

const props = withDefaults(defineProps<{
  combat: any;
  loading: any;
  onCellEditComplete: any;
  addPlayer: any;
  addTurn: any;
}>(), {
  combat: []
});

const turns = ref([]);

const updateTurns = (combat: any) => {
  console.log(combat.data[0]?.turn?.length);
  turns.value = combat.data[0]?.turn?.length || 0;

  console.log('turns', turns.value);
};

onMounted(() => {
  updateTurns(props.combat);
});

watch(() => props.combat, (newCombat) => {
  updateTurns(newCombat);
}, { deep: true });
</script>

<template>
  <div class="bg-white dark:bg-gray-900 shadow rounded mt-4 overflow-hidden">
    <DataTable :value="combat.data" editMode="cell" @cell-edit-complete="onCellEditComplete">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <Button icon="pi pi-user" :label="$t('combat.add_player')" severity="success" @click="addPlayer" />
          <Button icon="pi pi-plus" :label="$t('combat.add_turn')" severity="secondary" @click="addTurn" />
        </div>
      </template>
      <Column field="order" style="width: 5%" header="#">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>
      <Column field="name" :header="$t('common.name')">
        <template #editor="{ data, field }">
          <InputText v-if="data.type == 'player'" v-model="data[field]" autofocus fluid />
          <template v-else>{{ $t(data.name) }}</template>
        </template>
        <template #body="{ data }">
          {{ $t(data.name) }}
        </template>
      </Column>
      <Column field="initiative" :header="$t('common.initiative')">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="number" max="20" min="1" autofocus class="w-[75px]" />
        </template>
      </Column>
      <Column field="hp" :header="$t('common.hp')">
        <template #body="{ data }">
          {{ $t(data.hp) }}
        </template>
      </Column>
      <Column field="status" :header="$t('common.status')">
        <template #body="{ data }">
          <Tag :severity="data.status === 'alive' ? 'success' : 'danger'" :value="$t(data.status)"></Tag>
        </template>
      </Column>
      <Column v-for="(col, index) in turns" :key="index" :header="`${$t('common.turn')} ${index}`">
        <template #body="{ data }">{{ data.turn[index]?.hp }}
          <InputText v-if="data.turn[index] !== 'not_in_combat'" v-model="data.turn[index].hp" />
          <template v-else>
            {{ $t('combat.not_in_combat') }}
          </template>
        </template>
      </Column>
    </DataTable>
  </div>
</template>