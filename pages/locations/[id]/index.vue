<script setup lang="ts">
const user = useSupabaseUser();
import typesData from '@/tables/location_types.json';
import sizes from '@/tables/location_sizes.json';
import governmentsData from '@/tables/location_governments.json';
import alignments from '@/tables/alignments.json';

const t = useNuxtApp().$i18n.t;

const types = typesData.map((type) => ({
  value: type.value,
  label: t(type.label),
}));
const governments = governmentsData.map((government) => ({
  value: government.value,
  label: t(government.label),
}));
const location = ref({
  id: '',
  name: '',
  description: '',
  type: types[0],
  size: sizes[0],
  environment: '',
  region: '',
  population: '',
  government: governments[0],
  alignment: alignments[0],
  ruler: '',
  landmarks: [],
  history: [],
  notableNPCs: [],
  rumors: [],
  coordinates: { x: 0, y: 0 },     // For placing on a map, optional
  mapImage: '',                    // URL or path to an image
  tags: [],                        // Searchable keywords (e.g. ["underground", "elven"])
  connectedLocations: [],          // List of location IDs or names (roads, tunnels, etc.)
  factions: [],                    // Groups that influence or control the place
  quests: [],                      // List of quests or adventures associated with the location
});

const initialValues = reactive({
  type: types[0],
  size: sizes[0],
  government: governments[0],
  alignment: alignments[0],
});

const resolver = ({ values }: { values: any }) => {
  const errors: Record<string, { message: string }[]> = {};
  const requiredFields = ['name', 'description', 'type', 'size', 'environment', 'region', 'population', 'government', 'alignment', 'ruler'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = [{ message: t(`locations.form.error.${field}`) }];
    }
  });
  errors.coordinates_x = values.coordinates?.x ? [] : [{ message: t(`locations.form.error.coordinates_x`) }];
  errors.coordinates_y = values.coordinates?.y ? [] : [{ message: t(`locations.form.error.coordinates_y`) }];

  changeLocation(values);

  return { values, errors };
};

const changeLocation = (newLocation: Record<string, any>) => {
  Object.assign(location.value, newLocation);
  console.log(location.value);
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      item.image = e.target?.result ?? null; // Assign result to local state
    };
    reader.readAsDataURL(file);
  }
};

const onFormSubmit = async ({ values, valid }: { values: any, valid: boolean }) => {
  if (!valid) return;
};
</script>

<template>
  <div class="bg-white dark:bg-gray-900 p-6 shadow rounded-2xl flex flex-col gap-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <div>
        <div class="flex gap-4 mb-6">
            <div class="flex flex-col gap-2 flex-1">
                <div class="text-2xl leading-tight font-semibold text-surface-900 dark:text-surface-0">{{ $t('locations.form.title') }}</div>
                <div class="text-base leading-tight text-surface-500 dark:text-surface-300">{{ $t('locations.form.subtitle') }}</div>
            </div>
        </div>
        <div class="flex flex-1">
          <LOCATIONForm v-if="user" :location :onFormSubmit :onFileChange :resolver :initialValues :types :sizes :governments :alignments />
        </div>
      </div>
      <LOCATIONMap v-if="user" class="col-span-2" :location />
    </div>
  </div>
</template>