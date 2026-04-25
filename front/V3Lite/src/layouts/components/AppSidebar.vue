<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import SidebarMenuNode from './SidebarMenuNode.vue'
import { appEnv } from '@/constants/env'
import type { MenuItem } from '@/types/permission'
import { usePermissionStore } from '@/stores/permission'

withDefaults(
  defineProps<{
    collapsed?: boolean
  }>(),
  {
    collapsed: false,
  },
)

const permissionStore = usePermissionStore()
const route = useRoute()

const menus = computed(() => permissionStore.menuTree)
const openKeys = ref<Record<number, string | null>>({})

function collectOpenKeysByPath(
  items: MenuItem[],
  targetPath: string,
  level = 0,
): Record<number, string | null> {
  for (const item of items) {
    if (!item.children?.length) {
      continue
    }

    const isCurrentBranch = targetPath.startsWith(`${item.path}/`)

    if (!isCurrentBranch) {
      continue
    }

    return {
      [level]: item.path,
      ...collectOpenKeysByPath(item.children, targetPath, level + 1),
    }
  }

  return {}
}

function clearDeeperLevels(level: number) {
  const nextOpenKeys = { ...openKeys.value }

  Object.keys(nextOpenKeys).forEach((key) => {
    if (Number(key) > level) {
      delete nextOpenKeys[Number(key)]
    }
  })

  openKeys.value = nextOpenKeys
}

function expandLevel(level: number, path: string) {
  if (openKeys.value[level] === path) {
    return
  }

  openKeys.value = {
    ...openKeys.value,
    [level]: path,
  }
  clearDeeperLevels(level)
}

function collapseLevel(level: number) {
  openKeys.value = {
    ...openKeys.value,
    [level]: null,
  }
  clearDeeperLevels(level)
}

function toggleLevel(level: number, path: string) {
  if (openKeys.value[level] === path) {
    collapseLevel(level)
    return
  }

  expandLevel(level, path)
}

function isExpanded(level: number, path: string) {
  return openKeys.value[level] === path
}

watch(
  [menus, () => route.path],
  ([currentMenus, currentPath]) => {
    openKeys.value = collectOpenKeysByPath(currentMenus, currentPath)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <aside class="sidebar-shell" :class="{ 'sidebar-shell--collapsed': collapsed }">
    <div class="sidebar-brand">
      <div class="brand-mark">
        <span />
        <span />
      </div>
      <div>
        <p class="brand-title">{{ appEnv.title }}</p>
        <p class="brand-subtitle">{{ appEnv.subtitle }}</p>
      </div>
    </div>

    <div class="sidebar-menu">
      <SidebarMenuNode
        v-for="menu in menus"
        :key="menu.name"
        :is-expanded="isExpanded"
        :menu="menu"
        :toggle-level="toggleLevel"
        :open-keys="openKeys"
      />
    </div>

    <div class="sidebar-footer">
      <div class="status-dot" />
      <span>模板运行中</span>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar-shell {
  display: flex;
  height: 100vh;
  flex-direction: column;
  gap: 14px;
  padding: 14px 10px 12px;
  border-right: 1px solid var(--app-sidebar-border);
  background: var(--app-sidebar-bg);
  overflow: hidden;
  transition:
    padding 0.2s ease,
    gap 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.sidebar-shell--collapsed {
  gap: 0;
  padding: 0;
  border-right-color: transparent;
  pointer-events: none;

  > * {
    opacity: 0;
  }
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px 12px;
}

.brand-mark {
  position: relative;
  width: 32px;
  height: 32px;

  span {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    transform: rotate(45deg);

    &:first-child {
      background: linear-gradient(135deg, #7c3aed 0%, #38bdf8 100%);
    }

    &:last-child {
      inset: 10px 4px 0 12px;
      background: linear-gradient(135deg, #34d399 0%, #38bdf8 100%);
    }
  }
}

.brand-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.brand-subtitle {
  margin: 2px 0 0;
  font-size: 10px;
  color: var(--app-text-subtle);
}

.sidebar-menu {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--app-card-bg-secondary);
  color: var(--app-text-muted);
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 16px rgb(34 197 94 / 80%);
}
</style>
