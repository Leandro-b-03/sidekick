<script setup lang="ts">
const router = useRouter();

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push({ path: '/' });
    }
  },
]);

const itensTinyScreen = ref([
  {
    label: 'Home',
    command: () => {
      router.push({ path: '/' });
    }
  },
  {
    label: 'generate.npcs.title',
    icon: 'pi pi-user',
    items: [
      {
        label: 'generate.npcs.list',
        command: () => {
          router.push({ path: '/generate/npc' });
        }
      },
      {
        label: 'generate.npcs.create',
        command: () => {
          router.push({ path: '/generate/npc/new' });
        }
      }
    ]
  },
  {
    label: 'generate.items.title',
    icon: 'pi pi-box',
    items: [
      {
        label: 'generate.items.list',
        command: () => {
          router.push({ path: '/generate/item' });
        }
      },
      {
        label: 'generate.items.create',
        command: () => {
          router.push({ path: '/generate/item/new' });
        }
      }
    ]
  },
  {
    label: 'combat.title',
    icon: 'pi pi-shield',
    items: [
      {
        label: 'combat.list',
        command: () => {
          router.push({ path: '/combat' });
        }
      },
      {
        label: 'combat.create',
        command: () => {
          router.push({ path: '/combat/new' });
        }
      }
    ]
  }
]);
const button = ref({
  iconClass: 'pi-moon',
});

const onThemeToggler = (): void => {
  const root = document.getElementsByTagName('html')[0];

  root.classList.toggle('p-dark');
  button.value.iconClass = button.value.iconClass === 'pi-moon' ? 'pi-sun' : 'pi-moon';

  localStorage.setItem('theme', root.classList.contains('p-dark') ? 'dark' : 'light');
};
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-10 bg-surface shadow-md hidden lg:block">
    <Menubar :model="items" class="!rounded-none">
      <template #start>
        <img src="@/assets/images/logo.svg" alt="GM" class="h-10" />
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span>{{ $t(item.label) }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </a>
      </template>
      <template #end>
      </template>
    </Menubar>
  </div>

  <div class="fixed top-0 left-0 right-0 z-10 bg-surface shadow-md lg:hidden">
    <Menubar :model="itensTinyScreen" class="!rounded-none">
      <template #start>
        <img src="@/assets/images/logo.svg" alt="GM" class="h-10" />
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span>{{ $t(item.label) }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </a>
      </template>
      <template #end>
        <Button :icon="button.iconClass" @click="onThemeToggler" />
      </template>
    </Menubar>
  </div>
</template>