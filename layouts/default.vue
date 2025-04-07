<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"

const config = useRuntimeConfig();
const dev = import.meta.env.DEV;
</script>

<template>
  <Analytics v-if="dev != true" />
  <SpeedInsights v-if="dev != true" />
  <div class="app">
    <Toast />
    <AppHeader />
    <div class="flex flex-row mt-16">
      <AppSidebar />
      <section class="layout-content flex-1 p-2 mb-10 w-full lg:ml-64">
        <slot />
      </section>
    </div>
    <AppFooter />
  </div>
</template>