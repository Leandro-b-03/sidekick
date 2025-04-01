<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>

<template>
  <Analytics/>
  <SpeedInsights/>
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