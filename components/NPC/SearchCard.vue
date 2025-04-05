<script setup lang="ts">
const props = defineProps({
  npcs: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="flex flex-row flex-wrap gap-2">
    <TransitionFade group appear class="flex flex-row flex-wrap gap-2">
      <Card v-if="npcs?.length > 0" v-for="npc in npcs" class="w-[355px] h-[500px] mt-2 shadow-2xl overflow-hidden" :key="npc.$id">
        <template #header>
          <div class="header bg-gray-800 p-4 flex flex-row justify-between items-center mb-1">
            <div>
              <Skeleton v-if="loading" width="150px" height="35px" />
              <NuxtLink v-else :to="`/generate/npc/${npc.slug}`">
                <h2 class="text-3xl text-gray-50 mb-0" v-tooltip.top="npc.name">{{ textEllipsis(npc.name, 15) }}</h2>
              </NuxtLink>
              <Skeleton v-if="loading" width="100px" height="15px" class="mt-1" />
              <small v-else class="text-gray-50 relative -t-2">{{ (npc.age === -1) ? $t('age.unknown') : `${npc.age} ${$t('common.years')}` }} {{ `/ ${$t(`sex_orientation.${npc.sex_orientation}`)}` }} / <i class="text-xs">nv. {{ npc.level }}</i></small>
            </div>
          </div>
        </template>
        <template #content>
          <div class="h-[400px] relative">
            <div class="mb-1 w-full flex flex-row justify-start">
              <Skeleton v-if="loading" width="100px" height="15px" class="mb-1" />
              <h2 v-else class="text-gray-950 dark:text-gray-100 mr-2 text-lg">{{ $t(`classes.${npc.class}`) }}</h2>
              <Skeleton v-if="loading" width="100px" height="15px" />
              <h2 v-else class="text-gray-950 dark:text-gray-100 text-lg">{{ npc.job ? $t(`jobs.${npc.job}`) : '-' }}</h2>
            </div>
            <div class="mb-4">
              <Skeleton v-if="loading" width="100px" height="15px" class="mb-1" />
              <h4 v-else class="!text-[12px]">{{ $t(`races.${npc.race}`) }}</h4>
            </div>
            <div>
              <div class="mb-4 text-justify bg-gray-100 dark:bg-gray-700 p-1 rounded border border-gray-200 dark:border-gray-600">
                <Skeleton v-if="loading" width="100%" height="60px" />
                <p v-else class="text-gray-700 dark:text-gray-100 text-sm">{{ textEllipsis(npc.description, 325) }}</p>
              </div>
            </div>
            <div class="absolute bottom-6 w-full">
              <div class="attrs flex flex-row flex-wrap gap-1 mb-2 w-full">
                <div v-for="attr in npc.attr" class="flex items-center justify-center flex-col bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 w-[75px] dark:text-gray-100">
                  <div><h2 class="text-sm font-semibold">{{ attr.short }}</h2></div>
                  <div>
                    <div class="flex flex-row items-center justify-center gap-1">
                      <Skeleton v-if="loading" width="35px" height="20px" />
                      <div v-else>
                        <span class="font-light">{{ attr.value }}</span>
                        <span class="font-semibold text-gray-500 dark:text-gray-400"> ({{ attr.bonus }})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
      <Card v-else class="w-[355px] h-[500px] mt-2 shadow-2xl overflow-hidden">
        <template #content>
          <div class="h-[400px] w-full flex items-center justify-center">
            {{ $t('common.item_empty') }}
          </div>
        </template>
      </Card>
    </TransitionFade>
  </div>
</template>