<script setup lang="ts">
const props = defineProps({
  combats: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Format the creation date (basic example)
const formattedDate = (createdAt: string) => {
  if (!createdAt) return 'N/A';
  try {
    // You might want a more sophisticated date formatting library like date-fns
    return new Date(createdAt).toLocaleString('pt-BR'); // Using Brazil locale
  } catch (e) {
    return 'Invalid Date';
  }
};

// Determine Tag severity based on status
const statusSeverity = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'ongoing':
      return 'info';
    case 'abandoned':
      return 'warning';
    default:
      return 'secondary'; // Default gray tag
  }
};

// Determine Tag severity/text based on winner
const winnerSeverity = (won :string) => {
  switch (won?.toLowerCase()) {
    case 'players':
      return 'success'; // Green for players winning
    case 'monsters':
      return 'danger'; // Red for monsters winning
    case 'draw':
      return 'info' // Blue for a draw
    default:
      return 'secondary'; // Gray if no winner yet or unknown
  }
};
</script>

<template>
  <div class="flex flex-row flex-wrap gap-2">
    <TransitionFade group appear class="flex flex-row flex-wrap gap-2">
      <Card v-if="combats?.length > 0" v-for="combat in combats" class="w-[300px] h-[390px] mt-2 shadow-2xl overflow-hidden" :key="combat.id">
        <template #header>
          <div class="header bg-gray-800 p-4 flex flex-row justify-between items-center mb-1">
            <NuxtLink :to="`combat/${combat.id}`">
              <Skeleton v-if="loading" width="150px" height="35px" />
              <h2 class="text-2xl text-gray-50 mb-0">{{ $t('combat.summary') }}</h2>
            </NuxtLink>
          </div>
        </template>
        <template #subtitle>
            {{ `${$t('common.created')}: ${formattedDate(combat.created_at)}` }}
        </template>
        <template #content>
            <div class="flex flex-col gap-3">
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ $t('common.status') }}:</span>
                  <Tag :value="$t(`combat.${combat.status}`)" :severity="statusSeverity(combat.status)" />
                </div>
                <Divider layout="horizontal" />
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ $t('common.monsters') }}:</span>
                  <span class="font-semibold">{{ combat.monsters }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ $t('common.players') }}:</span>
                  <span class="font-semibold">{{ combat.players }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ $t('common.turns') }}:</span>
                  <span class="font-semibold">{{ combat.turns }}</span>
                </div>
                <Divider layout="horizontal" />
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ $t('common.winner') }}:</span>
                  <Tag :value="$t(`common.${combat.won}`)" :severity="winnerSeverity(combat.won)" />
                </div>
            </div>
        </template>
      </Card>
      <Card v-else class="w-[300px] h-[390px] mt-2 shadow-2xl overflow-hidden">
        <template #content>
          <div class="h-[340px] w-full flex items-center justify-center">
            {{ $t('common.combat_empty') }}
          </div>
        </template>
      </Card>
    </TransitionFade>
  </div>
</template>