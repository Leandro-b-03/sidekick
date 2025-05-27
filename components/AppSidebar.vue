<script setup lang="ts">
const router = useRouter();
const user = useSupabaseUser();

const expandedKeys = ref([]);
const items = ref([
  {
    key: 'npcs',
    label: 'generate.npcs.title',
    icon: 'pi pi-user',
    items: [
      {
        key: 'npcs-list',
        label: 'generate.npcs.list',
        icon: 'pi pi-list',
        shortcut: 'Ctrl+Shift+1',
        command: () => router.push('/generate/npc')
      },
      {
        key: 'npcs-create',
        label: 'generate.npcs.create',
        icon: 'pi pi-plus',
        shortcut: 'Ctrl+Shift+Alt+1',
        command: () => router.push('/generate/npc/new')
      }
    ]
  },
  {
    key: 'items',
    label: 'generate.items.title',
    icon: 'pi pi-box',
    items: [
      {
        key: 'items-list',
        label: 'generate.items.list',
        icon: 'pi pi-list',
        shortcut: 'Ctrl+Shift+2',
        command: () => router.push('/generate/item')
      },
      {
        key: 'items-create',
        label: 'generate.items.create',
        icon: 'pi pi-plus',
        shortcut: 'Ctrl+Shift+Alt+2',
        command: () => router.push('/generate/item/new')
      }
    ]
  },
  {
    key: 'combat',
    label: 'combat.title',
    icon: 'pi pi-shield',
    items: [
      {
        key: 'combat-list',
        label: 'combat.initiative.list',
        icon: 'pi pi-list',
        shortcut: 'Ctrl+Shift+3',
        command: () => router.push('/combat')
      },
      {
        key: 'combat-list',
        label: 'combat.initiative.title',
        icon: 'pi pi-cog',
        shortcut: 'Ctrl+Shift+Alt+3',
        command: () => router.push('/combat/new')
      }
    ]
  },
  {
    key: 'locations',
    label: 'locations.title',
    icon: 'pi pi-map',
    visible: user.value?.aud === 'authenticated',
    items: [
      {
        key: 'locations-list',
        label: 'locations.list',
        icon: 'pi pi-list',
        shortcut: 'Ctrl+Shift+4',
        command: () => router.push('/locations')
      },
      {
        key: 'locations-create',
        label: 'locations.create',
        icon: 'pi pi-plus',
        shortcut: 'Ctrl+Shift+Alt+4',
        command: () => router.push('/locations/new')
      },
      {
        key: 'buildings',
        label: 'buildings.title',
        icon: 'pi pi-building',
        visible: user.value?.aud === 'authenticated',
        items: [
          {
            key: 'buildings-list',
            label: 'buildings.title',
            icon: 'pi pi-list',
            shortcut: 'Ctrl+Shift+7',
            command: () => router.push('/locations/buildings')
          },
          {
            key: 'buildings-create',
            label: 'buildings.create',
            icon: 'pi pi-plus',
            shortcut: 'Ctrl+Shift+Alt+7',
            command: () => router.push('/locations/buildings/new')
          }
        ]
      }
    ]
  },
  {
    key: 'adventures',
    label: 'adventures.title',
    icon: 'pi pi-book',
    visible: user.value?.aud === 'authenticated',
    items: [
      {
        key: 'adventures-list',
        label: 'adventures.list',
        icon: 'pi pi-list',
        shortcut: 'Ctrl+Shift+5',
        command: () => router.push('/adventures')
      },
      {
        key: 'adventures-create',
        label: 'adventures.create',
        icon: 'pi pi-plus',
        shortcut: 'Ctrl+Shift+Alt+5',
        command: () => router.push('/adventures/new')
      }
    ]
  },
  {
    key: "characters",
    label: "characters.title",
    icon: "pi pi-users",
    visible: user.value?.aud === 'authenticated',
    items: [
      {
        key: "characters-list",
        label: "characters.list",
        icon: "pi pi-list",
        shortcut: "Ctrl+Shift+6",
        command: () => router.push("/characters")
      },
      {
        key: "characters-create",
        label: "characters.create",
        icon: "pi pi-plus",
        shortcut: "Ctrl+Shift+Alt+6",
        command: () => router.push("/characters/new")
      }
    ]
  }
]);

function handleShortcut(event: KeyboardEvent) {
  const shortcutMap: Record<string, string> = {
    'Ctrl+Shift+1': '/generate/npc',
    'Ctrl+Shift+!': '/generate/npc',
    'Ctrl+Shift+Alt+1': '/generate/npc/new',
    'Shift+¹': '/generate/npc/new',
    'Ctrl+Shift+2': '/generate/item',
    'Ctrl+Shift+@': '/generate/item',
    'Ctrl+Shift+Alt+2': '/generate/item/new',
    'Ctrl+Shift+Alt+@': '/generate/item/new',
    'Ctrl+Shift+3': '/combat',
    'Ctrl+Shift+#': '/combat',
    'Ctrl+Shift+Alt+3': '/combat/new',
    'Ctrl+Shift+Alt+#': '/combat/new',
  };

  const pressedKeys = [
    event.ctrlKey ? 'Ctrl' : '',
    event.shiftKey ? 'Shift' : '',
    event.altKey ? 'Alt' : '',
    event.key.toUpperCase(),
  ]
    .filter(Boolean)
    .join('+');

  if (shortcutMap[pressedKeys]) {
    event.preventDefault();
    event.stopPropagation();
    router.push(shortcutMap[pressedKeys]);
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleShortcut);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut);
});
</script>

<template>
  <aside class="layout-sidebar m-2 hidden md:w-60 lg:block fixed">
    <PanelMenu v-model:expandedKeys="expandedKeys" :model="items" class="w-full">
      <template #item="{ item }">
        <NuxtLink v-ripple class="flex items-center justify-between px-4 py-2 cursor-pointer group">
          <div class="flex items-center">
            <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
            <span :class="['ml-2', { 'font-semibold': item.items }]">{{ $t(item.label) }}</span>
          </div>
          <span v-if="item.shortcut" class="ml-1 border border-gray-200 rounded bg-gray-100 dark:bg-gray-600 text-muted-color text-[8px] p-1">{{ item.shortcut }}</span>
        </NuxtLink>
      </template>
      
    </PanelMenu>
  </aside>
</template>