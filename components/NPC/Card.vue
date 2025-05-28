<script setup lang="ts">
import type { NpcLocalState } from '@/interfaces/npc.type';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  npc: {
    type: Object as PropType<NpcLocalState>,
    required: true,
  },
  onFileChange: {
    type: Function as PropType<(file: File) => void>,
    required: true,
  },
});

const showButtons = ref(false);
const file = ref(null);
const pdfSection = ref<HTMLElement | null>(null);

console.log('NPC Card', props.npc);

/**
 * Programmatically triggers the click event on the hidden file input element
 * to open the file selection dialog.
 */
 const openUpload = () => {
  // Safety check: ensure the ref is attached to an element
  if (file.value) {
    file.value.click();
  } else {
    console.warn('File input reference is not available.');
  }
};

/**
 * Calls the utility function to generate a PDF from the specified HTML section.
 */
const generatePDF = () => {
  // Safety check: ensure the ref is attached to an element
  if (pdfSection.value) {
    printSection(pdfSection.value, { portrait: true }); // Call your print utility
  } else {
    console.warn('PDF section reference is not available.');
  }
};

/**
 * Calculates the proficiency bonus based on character level according to D&D 5e rules.
 * Calcula o bônus de proficiência baseado no nível do personagem (regras D&D 5e).
 * @param {number | undefined | null} level - The character's level. O nível do personagem.
 * @returns {string} The proficiency bonus as a string (e.g., "2", "3"). O bônus como string.
 */
const proficiency = (level: number | undefined | null): string => { // Corrected spelling: proficiency
  const lvl = level ?? 0; // Handle null or undefined level, defaulting to 0

  if (lvl >= 1 && lvl <= 4) return '2';
  if (lvl >= 5 && lvl <= 8) return '3';
  if (lvl >= 9 && lvl <= 12) return '4';
  if (lvl >= 13 && lvl <= 16) return '5';
  if (lvl >= 17 && lvl <= 20) return '6';

  // Handle levels outside 1-20. Returning "10" seems arbitrary.
  // Consider returning "0" or "+0" or handling appropriately.
  // Mantendo "10" como no código original, mas considere se é o correto.
  console.warn(`Calculating proficiency for unexpected level: ${lvl}`);
  return '10'; // Or maybe '0'?
};
</script>

<template>
  <TransitionGroup name="fade">
    <div v-if="npc.show" class="bg-gray-50 dark:bg-gray-950 mt-4 rounded" key="npc">
      <div class="bg-gray-0 dark:bg-gray-900 lg:p-6 shadow rounded">
        <div class="text-3xl font-medium text-gray-900 dark:text-gray-0 mb-2 ml-2 lg:ml-0">
          <Skeleton v-if="loading" height="25px" width="150px" />
          <span v-else>{{ $t('generate.npcs.title') }}</span>
        </div>
        <div class="font-medium text-gray-500 dark:text-gray-300 mb-4 ml-2 lg:ml-0">
          <Skeleton v-if="loading" width="100px" />
          <span v-else>{{ $t('generate.npcs.description') }}</span>
        </div>
        <div class="relative">
          <div class="absolute left-2 top-2 w-full">
            <Button label="gerar PDF" @click="generatePDF" />
          </div>
          <div class="flex justify-center items-center inset-shadow-sm w-full h-auto rounded inset-shadow-gray-500 dark:inset-shadow-gray-900 striped-bg">
            <div class="grid grid-cols-1 w-full lg:w-[900px] h-auto lg:h-auto bg-white dark:bg-gray-900 shadow rounded overflow-hidden content-between" ref="pdfSection">
              <div class="header bg-gray-800 p-4 flex flex-row justify-between items-center mb-1">
                <div>
                  <Skeleton v-if="loading" width="150px" height="35px" />
                  <h2 v-else class="text-3xl text-gray-50 mb-0">{{ npc.name }} <i class="text-xs">nv. {{ npc.level }}</i></h2>
                  <Skeleton v-if="loading" width="100px" height="15px" class="mt-1" />
                  <small v-else class="text-gray-50 relative -t-2">{{ (npc.age === -1) ? $t('age.unknown') : `${npc.age} ${$t('common.years')}` }} {{ `/ ${$t(`sex_orientation.${npc.sexOrientation}`)}` }}</small>
                </div>
                <div class="flex flex-col">
                  <Skeleton v-if="loading" width="100px" height="15px" class="mb-1" />
                  <small v-else class="text-gray-50">{{ $t(`races.${npc.race}`) }}</small>
                  <Skeleton v-if="loading" width="100px" height="15px" class="mb-1" />
                  <small v-else class="text-gray-50">{{ $t(`classes.${npc.class}`) }}</small>
                  <Skeleton v-if="loading" width="100px" height="15px" />
                  <small v-else class="text-gray-50">{{ npc.job ? $t(`jobs.${npc.job}`) : '-' }}</small>
                </div>
              </div>
              <div class="body px-2">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div>
                    <div class="flex flex-row justify-start">
                      <div class="flex flex-row justify-start mr-2 w-[114px] flex-none">
                        <div class="relative h-auto overflow-hidden"
                            @mouseover="showButtons = true"
                            @mouseleave="showButtons = false">
                          <transition name="fade">
                            <div v-show="showButtons" class="absolute flex flex-row justify-between w-full top-0 left-0 z-10 p-2">
                              <Button icon="pi pi-upload" severity="secondary" @click="openUpload" />
                              <input type="file" ref="file" class="hidden" @change="onFileChange" />
                            </div>
                          </transition>
                          <Image :src="npc.image" :alt="npc.name" class="rounded h-auto" preview />
                        </div>
                      </div>
                      <table class="grow table-auto w-full border-separate mb-2">
                        <tbody>
                          <tr class="border-b border-gray-300">
                            <td class="bg-gray-200 dark:bg-gray-700 p-1 rounded-tl w-[40%] text-right alegreya">{{ `${$t('common.armor_i')} ${$t('common.class_i')}` }}</td>
                            <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-tr">
                              <Skeleton v-if="loading" width="15px" height="15px" />
                              <span v-else>{{ npc.armourClass }}</span>
                            </td>
                          </tr>
                          <tr class="border-b border-gray-300">
                            <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right alegreya">{{ $t('common.hit_points') }}</td>
                            <td class="bg-gray-100 dark:bg-gray-600 p-1">
                              <Skeleton v-if="loading" width="50px" height="15px" />
                              <span v-else>{{ npc.hitPoints }} <small class="text-xs">{{ npc.hitDice }}</small></span>
                            </td>
                          </tr>
                          <tr class="">
                            <td class="bg-gray-200 dark:bg-gray-700 p-1 rounded-bl text-right alegreya">{{ $t('common.speed') }}</td>
                            <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-br">
                              <Skeleton v-if="loading" width="80px" height="15px" />
                              <span v-else>{{ npc.speed }}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="attrs flex flex-row justify-between gap-1 mb-2">
                      <div v-for="attr in npc.attr" class="flex items-center justify-center flex-col bg-gray-100 dark:bg-gray-600 rounded px-2 py-1 w-[75px]">
                        <div><h2 class="text-sm font-semibold">{{ attr.short }}</h2></div>
                        <div>
                          <div class="flex flex-row items-center justify-center gap-1">
                            <Skeleton v-if="loading" width="35px" height="20px" />
                            <div v-else>
                              <span class="font-light">{{ attr.value }}</span>
                              <span class="font-semibold text-gray-500"> ({{ attr.bonus }})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <table class="w-full border-separate mb-2">
                      <tbody>
                        <tr class="border-b border-gray-300">
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right rounded-tl w-[40%]">{{ $t('common.saving_throws') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-tr">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <div v-else class="flex flex-row gap-1">
                              <Tag v-for="value in npc.savingThrows.split(',')" :key="`saving-${value}`" :value="`${value}`" severity="info" size="small" />
                            </div>
                          </td>
                        </tr>
                        <tr class="border-b border-gray-300">
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right">{{ $t('common.languages') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <div v-else class="flex flex-row gap-1">
                              <Tag v-for="value in npc.languages.split(',')" :key="`saving-${value}`" :value="`${value}`" severity="warn" size="small" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 rounded-bl text-right">{{ $t('common.difficult') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-br">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <span v-else>{{ $t(`difficulty.${npc.difficult}`) }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right">{{ $t('common.proficiency') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <span v-else>+{{ proficiency(npc.level) }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 rounded-bl text-right">{{ $t('common.initiative') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-br">
                            <Skeleton v-if="loading" width="15px" height="15px" />
                            <span v-else>{{ npc.initiative }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="w-full border-separate mb-2">
                      <tbody>
                        <tr class="border-b border-gray-300">
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right rounded-tl w-[40%]">{{ $t('items.weapon') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-tr">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <span v-else>{{ npc.items.weapon }}</span>
                          </td>
                        </tr>
                        <tr class="border-b border-gray-300">
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right">{{ $t('items.armor') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <span v-else>{{ npc.items.armor }}</span>
                          </td>
                        </tr>
                        <tr class="border-b border-gray-300">
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right">{{ $t('items.other') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <span v-else>{{ npc.items.other }}</span>
                          </td>
                        </tr>
                        <tr class="border-b border-gray-300">
                          <td class="bg-gray-200 dark:bg-gray-700 p-1 rounded-bl text-right">{{ $t('items.potions') }}</td>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-br">
                            <Skeleton v-if="loading" width="80px" height="15px" />
                            <span v-else>{{ npc.potions }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <table class="w-full border-separate mb-2">
                      <thead>
                        <tr>
                          <th colspan="2" class="bg-gray-200 dark:bg-gray-700 p-1 text-center rounded-t">{{ $t('spells.title') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="loading" class="border-b border-gray-300">
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-br">
                            <Skeleton width="80px" height="15px" />
                          </td>
                        </tr>

                        <template v-else-if="npc.spells.level_n === undefined">
                          <template v-for="(spells, levelKey) in npc.spells" :key="levelKey">
                            <tr v-if="spells && spells.length > 0" class="border-b border-gray-300">
                              <td class="bg-gray-200 dark:bg-gray-700 p-1 text-right"  :class="{ 'rounded-bl': isLastLevel(npc.spells, levelKey) }">{{ $t(`spells.${levelKey}`) }}</td>
                              <td class="bg-gray-100 dark:bg-gray-600 p-1" :class="{ 'rounded-br': isLastLevel(npc.spells, levelKey) }">
                                <div class="flex flex-row gap-1">
                                  <Tag v-for="(spell, index) in spells" :key="`spell-${levelKey}-${index}`" :value="spell" severity="success" size="small" />
                                </div>
                              </td>
                            </tr>
                          </template>
                        </template>

                        <tr v-else>
                          <td class="bg-gray-100 dark:bg-gray-600 p-1 rounded-br">
                            <span>{{ $t('spells.none') }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <div class="rounded bg-gray-100 dark:bg-gray-600 overflow-hidden mb-2">
                    <div class="bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-tl">
                      <h2 class="font-semibold text-base">{{ $t('common.description') }}</h2>
                    </div>
                    <div class="text-justify text-xs p-2">
                      <Skeleton v-if="loading" width="100%" height="100px" />
                      <p v-else>{{ npc.description }}</p>
                    </div>
                  </div>
                  <div class="rounded bg-gray-100 dark:bg-gray-600 overflow-hidden mb-2">
                    <div class="bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-tl">
                      <h2 class="font-semibold text-base">{{ $t('appearances.title') }}</h2>
                    </div>
                    <div class="text-justify text-xs p-2">
                      <Skeleton v-if="loading" width="100%" height="100px" />
                      <p v-else>{{ npc.appearanceDescription	 }}</p>
                    </div>
                  </div>
                  <div class="rounded bg-gray-100 dark:bg-gray-600 overflow-hidden mb-2">
                    <div class="bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-tl">
                      <h2 class="font-semibold text-base">{{ $t('secret_plot.title') }}</h2>
                    </div>
                    <div class="text-justify text-xs p-2">
                      <Skeleton v-if="loading" width="100%" height="100px" />
                      <p v-else>{{ npc.secretPlot }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer w-full h-7 bg-gray-200 dark:bg-gray-700 px-2 py-1">
                <div class="flex flex-row justify-between items-center">
                  <div class="flex flex-row gap-2">
                    {{ $t('card.footer_left') }}
                  </div>
                  <div class="flex flex-row gap-2">
                    {{ $t('card.footer_right') }} {{ new Date().getFullYear() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>