<script setup lang="ts">
const router = useRouter();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const t = useNuxtApp().$i18n.t;

const userPanel = ref();
const items = ref([
  {
    label: 'home.title',
    icon: 'pi pi-home',
    command: () => {
      router.push({ path: '/' });
    }
  },
]);

const itensTinyScreen = ref([
  {
    label: 'home.title',
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
        label: 'combat.initiative.list',
        command: () => {
          router.push({ path: '/combat' });
        }
      },
      {
        label: 'combat.initiative.title',
        command: () => {
          router.push({ path: '/combat/new' });
        }
      }
    ]
  }
]);
const userMenu = ref([
  {
    label: t('common.profile'),
    icon: 'pi pi-fw pi-user',
    command: () => {
      router.push({ path: '/profile' });
    }
  },
  {
    label: t('common.settings'),
    icon: 'pi pi-fw pi-cog',
    command: () => {
      router.push({ path: '/settings' });
    }
  },
  { separator: true },
  {
    label: t('common.sign-out'),
    icon: 'pi pi-fw pi-sign-out',
    command: () => {
      signOut();
    }
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

const toggle = (event) => {
  userPanel.value.toggle(event);
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
}
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-10 bg-surface shadow-md hidden lg:block">
    <Menubar :model="items" class="!rounded-none">
      <template #start>
        <img src="@/assets/images/logo.svg" :alt="$t('sidekick')" class="h-10" />
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
        <div class="flex items-center h-full w-full gap-2">
          <Button :icon="`pi ${button.iconClass}`" severity="secondary" @click="onThemeToggler" />
          <NuxtLink v-if="!user" v-ripple class="flex items-center" :to="{ path: '/login' }">
            <Button :label="$t('common.login')" severity="secondary" />
          </NuxtLink>
          <Button v-else severity="secondary" class="!py-1" @click="toggle">
            <Avatar :image="user.user_metadata.avatar_url" shape="circle" />
            <span class="ml-2 text-sm font-semibold text-surface-900 dark:text-surface-300">
              {{ user.user_metadata.full_name || user.email }}
            </span>
          </Button>
          <Popover ref="userPanel">
            <Menu :model="userMenu" class="!border-none" />
          </Popover>
        </div>
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
        <div class="flex items-center h-full w-full">
          <Button :icon="`pi ${button.iconClass}`" severity="secondary" @click="onThemeToggler" />
        </div>
      </template>
    </Menubar>
  </div>
</template>