<script setup lang="ts">
import type { MonsterInfo, MonsterFormValues } from '~/interfaces/combat.type';

const route = useRoute();

const props = defineProps({
  monsters: {
    type: Array as PropType<MonsterInfo[]>,
    required: true,
  },
  initialValues: {
    type: Object, // Use the specific form values interface
    required: true,
  },
  resolver: {
    type: Function,
    required: true,
  },
  onFormSubmit: {
    type: Function,
    required: true,
  },
  panelCollapsed: { // Renamed from panelCollapsed (typo) in the original provided code snippet's watch
    type: Boolean,
    required: false, // Parent controls this state
  },
  loading: {
    type: Boolean,
    default: false, // Loading might have a sensible default
  }
});

const panelCollapsed = ref(props.panelCollapsed);
const search = ref(route.params.id ? false : true);
const header = ref(!search.value ? 'combat.add.header' : 'search.combat.header');
const panel = ref(null);

/**
 * Selects a random monster from the list and sets quantity to 1.
 * Note: This mutates the form state directly via the refs passed from the <Form> component's slot.
 * @param monsterRef A ref holding the currently selected monster object in the form.
 * @param qtdRef A ref holding the quantity value in the form.
 */
 const randomMonster = (monsterRef: Ref<MonsterInfo | undefined>, qtdRef: Ref<number | undefined>) => {
  if (props.monsters.length > 0) {
    // Select a random monster. Ensure index is valid.
    const randomIndex = Math.floor(Math.random() * props.monsters.length);
    monsterRef.value = props.monsters[randomIndex];
  } else {
     monsterRef.value = undefined; // Handle empty monster list case
  }
  qtdRef.value = 1; // Set quantity to 1
};
</script>

<template>
  <transition-fade group>
    <Panel :header="$t(header)" class="w-full shadow-sm" toggleable :collapsed="panelCollapsed" ref="panel">
      <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div class="grid grid-cols-2 gap-1">
            <div class="flex flex-col gap-1" key="monsters">
              <label for="monster" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('monsters.title') }}</label>
              <Select :options="monsters" optionLabel="label" name="monster" type="text" placeholder="monster" fluid>
                <template #value="{ value }">
                  <div class="flex flex-row items-center gap-2">
                    <span>{{ $t(value.label) }}</span>
                  </div>
                </template>
                <template #option="{ option }">
                  <div class="flex flex-row items-center gap-2">
                    <span>{{ $t(option.label) }}</span>
                  </div>
                </template>
              </Select>
              <Message v-if="$form.type?.invalid" severity="error" size="small" variant="simple">{{ $form.type.error?.message }}</Message>
            </div>
            <div class="flex flex-col gap-1" key="monster_qtd">
              <label for="monster_qtd" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('common.quantity_short') }}</label>
              <div class="-mt-[1px] flex flex-row items-center gap-2">
                <InputText name="monster_qtd" type="number" placeholder="1" class="w-20 h-[2.45rem]" />
                <Message v-if="$form.type?.invalid" severity="error" size="small" variant="simple">{{ $form.type.error?.message }}</Message>
                <Button icon="pi pi-refresh" type="button" class="w-10 h-[2.45rem]" @click="randomMonster($form.monster, $form.monster_qtd)" />
                <Button icon="pi pi-plus" type="submit" class="w-10 h-[2.45rem]" />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Panel>
  </transition-fade>
</template>