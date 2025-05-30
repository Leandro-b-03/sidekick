<script setup lang="ts">
import type { SelectOption } from '@/interfaces/common.type';

const route = useRoute();

const props = defineProps({
  types: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  classesData: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  rarities: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  damages: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  weapons: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  wondrousItems: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
  },
  onFormSubmit: {
    type: Function,
    required: true,
  },
  initialValues: {
    type: Object as PropType<SelectOption>,
    required: true,
  },
  resolver: {
    type: Function,
    required: true,
  },
  panelCollapsed: {
    type: Boolean,
    required: true,
  },
  loading: {
      type: Boolean,
      default: false,
  }
});

const type = ref('');
const panelCollapsed = ref(props.panelCollapsed);
const search = ref(route.params.id ? false : true);
const header = ref(!search.value ? 'generate.items.header' : 'search.items.header');
const button = ref(!search.value ? 'common.generate' : 'search.title');
const panel = ref(null);

watch(() => props.panelCollapsed, () => {
  if (props.panelCollapsed === true) {
    panel.value.toggle();
  }
});

/**
 * Handles the change event from the item type selection component.
 * @param {SelectOption | string | number} value - The new value selected. Type depends on the component emitting it.
 */
const changeType = (type_: Event) => {
  type.value = type_.value;
};
</script>

<template>
  <transition-fade group>
    <Panel :header="$t(header)" class="w-full shadow-sm" toggleable :collapsed="panelCollapsed" ref="panel">
      <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div class="flex flex-col gap-1" key="type">
            <label for="type" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('type.title') }}</label>
            <Select :options="types" optionLabel="label" name="type" type="text" placeholder="type" fluid @change="changeType($event)">
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
          <div class="flex flex-col gap-1" key="classesData">
            <label for="class_" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('classes.title') }}</label>
            <Select :options="classesData" optionLabel="label" name="class_" type="text" placeholder="class" fluid>
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
            <Message v-if="$form.class_?.invalid" severity="error" size="small" variant="simple">{{ $form.class_.error?.message }}</Message>
          </div>
          <div class="flex flex-col gap-1" key="rarity">
            <label for="rarity" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('rarities.title') }}</label>
            <Select :options="rarities" optionLabel="label" name="rarity" type="text" placeholder="rarity" fluid>
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
            <Message v-if="$form.rarity?.invalid" severity="error" size="small" variant="simple">{{ $form.rarity.error?.message }}</Message>
          </div>
          <div class="flex flex-col gap-1" key="damage">
            <label for="damage" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('damage.title') }}</label>
            <Select :options="damages" optionLabel="label" name="damage" type="text" placeholder="damage" fluid>
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
            <Message v-if="$form.rarity?.invalid" severity="error" size="small" variant="simple">{{ $form.rarity.error?.message }}</Message>
          </div>
          <div class="flex flex-col gap-1" key="weapon" v-if="type.value === 'weapon'">
            <label for="weapons" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('weapons.title') }}</label>
            <Select :options="weapons" optionLabel="label" name="weapons" type="text" placeholder="weapons" fluid>
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
            <Message v-if="$form.weapons?.invalid" severity="error" size="small" variant="simple">{{ $form.weapons.error?.message }}</Message>
          </div>
          <div class="flex flex-col gap-1" key="wondrousItems" v-if="type.value === 'wondrous_item'">
            <label for="wondrous_items" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('wondrous_items.title') }}</label>
            <Select :options="wondrousItems" optionLabel="label" name="wondrous_items" type="text" placeholder="wondrousItems" fluid>
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
            <Message v-if="$form.wondrousItems?.invalid" severity="error" size="small" variant="simple">{{ $form.wondrousItems.error?.message }}</Message>
          </div>
        </div>
        <Button type="submit" severity="secondary" :label="$t(button)" :loading="loading" />
      </Form>
    </Panel>
  </transition-fade>
</template>