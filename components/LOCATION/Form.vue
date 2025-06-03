<script setup lang="ts">
import type { SelectOption } from '@/interfaces/common.type';

const props = defineProps({
  location: {
    type: Object as PropType<Record<string, any>>,
    required: true
  },
  types: {
    type: Array as PropType<SelectOption[]>,
    required: true,
  },
  sizes: {
    type: Array as PropType<SelectOption[]>,
    required: true,
  },
  governments: {
    type: Array as PropType<SelectOption[]>,
    required: true,
  },
  alignments: {
    type: Array as PropType<SelectOption[]>,
    required: true,
  },
  onFileChange: {
    type: Function,
    required: true,
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
  loading: {
    type: Boolean,
    default: false,
  }
});
</script>

<template>
  <Form v-slot="$form" :initialValues :resolver :validateOnValueUpdate="true" :validateOnBlur="true" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-2">
      <div class="col-span-2 flex flex-col gap-1" key="name">
        <label for="name" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.name') }}</label>
        <InputText name="name" type="text" :placeholder="$t('locations.form.name-placeholder')" :disabled="loading" />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="col-span-2 flex flex-col gap-1" key="description">
        <label for="description" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.type') }}</label>
        <Select :options="types" optionLabel="label" :filter="true" name="type" type="text" placeholder="type" :disabled="loading">
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
      <div class="col-span-4 flex flex-col gap-1" key="description">
        <label for="description" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.description') }}</label>
        <Textarea name="description" :placeholder="$t('locations.form.description-placeholder')" :disabled="loading" />
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{ $form.description.error?.message }}</Message>
      </div>
      <div class="col-span-2 flex flex-col gap-1" key="region">
        <label for="region" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.region') }}</label>
        <InputText name="region" type="text" :placeholder="$t('locations.form.region-placeholder')" :disabled="loading" />
        <Message v-if="$form.region?.invalid" severity="error" size="small" variant="simple">{{ $form.region.error?.message }}</Message>
      </div>
      <div class="col-span-2 flex flex-col gap-1" key="population">
        <label for="population" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.population') }}</label>
        <InputNumber name="population" type="number" :placeholder="$t('locations.form.population-placeholder')" :disabled="loading" :min="0" showButtons />
        <Message v-if="$form.population?.invalid" severity="error" size="small" variant="simple">{{ $form.population.error?.message }}</Message>
      </div>
      <div class="col-span-2 flex flex-col gap-1" key="size">
        <label for="description" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.size') }}</label>
        <Select :options="sizes" optionLabel="label" name="size" type="text" placeholder="size" :disabled="loading">
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
        <Message v-if="$form.size?.invalid" severity="error" size="small" variant="simple">{{ $form.size.error?.message }}</Message>
      </div>
      <div class="col-span-2 flex flex-col gap-1" key="government">
        <label for="government" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.government') }}</label>
        <Select :options="governments" optionLabel="label" :filter="true" name="government" type="text" placeholder="government" :disabled="loading">
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
        <Message v-if="$form.government?.invalid" severity="error" size="small" variant="simple">{{ $form.government.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1" key="coordinates-x">
        <label for="coordinates-x" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.coordinates-x') }}</label>
        <InputNumber name="coordinates_x" type="number" :placeholder="$t('locations.form.coordinates-x-placeholder')" :disabled="loading" :min="0" showButtons fluid />
        <Message v-if="$form.coordinates_x?.invalid" severity="error" size="small" variant="simple">{{ $form.coordinates_x.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1" key="coordinates-y">
        <label for="coordinates-y" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('locations.form.coordinates-y') }}</label>
        <InputNumber name="coordinates_y" type="number" :placeholder="$t('locations.form.coordinates-y-placeholder')" :disabled="loading" :min="0" showButtons fluid />
        <Message v-if="$form.coordinates_y?.invalid" severity="error" size="small" variant="simple">{{ $form.coordinates_y.error?.message }}</Message>
      </div>
      <div class="col-span-2 flex flex-col gap-1" key="alignment">
        <label for="alignment" class="text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">{{ $t('alignments.title') }}</label>
        <Select :options="alignments" optionLabel="label" name="alignment" type="text" placeholder="alignment" :disabled="loading">
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
        <Message v-if="$form.alignment?.invalid" severity="error" size="small" variant="simple">{{ $form.alignment.error?.message }}</Message>
      </div>
    </div>
  </Form>
</template>