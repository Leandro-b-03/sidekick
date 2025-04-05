<template>
  <footer class="layout-footer bg-surface text-on-surface fixed bottom-0 w-full p-2 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
    <div class="flex justify-center items-center gap-1">
      <span class="text-primary font-semibold">{{ $t('sidekick') }} <span class="text-primary">{{ $t('app') }}</span></span> 
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </div>
  </footer>
</template>