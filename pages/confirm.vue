<script setup lang="ts">
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(user, () => {
  if (user.value) {
    // Get redirect path, and clear it from the cookie
    const path = redirectInfo.pluck();
    // Redirect to the saved path, or fallback to home
    return navigateTo(path || '/');
  }
}, { immediate: true });
</script>

<template>
  <div class="px-8 py-20 md:px-12 lg:px-20 flex items-center justify-center backdrop-blur-3xl !bg-cover !bg-center !bg-no-repeat" >
    <div class="px-8 md:px-12 lg:px-20 py-12 flex flex-col items-center gap-12 w-full max-w-xl backdrop-blur-2xl rounded-2xl bg-white border border-white dark:bg-gray-900 dark:border-gray-700 shadow-lg">
      <div class="flex flex-col items-center gap-4 w-full">
        <div class="flex flex-row gap-2 w-full">
          <i class="pi pi-spin pi-spinner text-5xl text-green-500 self-center" />
          <span class="self-center">{{ $t('common.confirm-login') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>