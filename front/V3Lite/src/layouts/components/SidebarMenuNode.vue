<script setup lang="ts">
defineOptions({
  name: 'SidebarMenuNode',
})

import {
  ArrowDown,
  ArrowRight,
  Briefcase,
  DataAnalysis,
  Document,
  FolderOpened,
  Grid,
  Monitor,
  Operation,
  Tickets,
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import type { Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MenuItem } from '@/types/permission'

const props = withDefaults(
  defineProps<{
    isExpanded: (level: number, path: string) => boolean
    level?: number
    menu: MenuItem
    openKeys: Record<number, string | null>
    toggleLevel: (level: number, path: string) => void
  }>(),
  {
    level: 0,
  },
)

const iconMap: Record<string, Component> = {
  Briefcase,
  DataAnalysis,
  Document,
  FolderOpened,
  Grid,
  Monitor,
  Operation,
  Tickets,
}

const route = useRoute()
const router = useRouter()

const hasChildren = computed(() => Boolean(props.menu.children?.length))
const isLeaf = computed(() => !hasChildren.value)
const isLeafActive = computed(() => isLeaf.value && route.path === props.menu.path)
const expanded = computed(() => hasChildren.value && props.isExpanded(props.level, props.menu.path))

function resolveIcon(icon?: string) {
  return (icon && iconMap[icon]) || Monitor
}

function handleAction() {
  if (hasChildren.value) {
    props.toggleLevel(props.level, props.menu.path)
    return
  }

  void router.push(props.menu.path)
}
</script>

<template>
  <div class="menu-node" :class="`menu-node--level-${level}`">
    <button
      type="button"
      class="menu-button"
      :class="{
        'menu-button--active': isLeafActive,
        'menu-button--branch-open': hasChildren && expanded,
      }"
      @click="handleAction"
    >
      <span class="menu-button__main">
        <ElIcon class="menu-button__icon">
          <component :is="resolveIcon(menu.meta.icon)" />
        </ElIcon>
        <span class="menu-button__label">{{ menu.meta.title }}</span>
      </span>

      <ElIcon v-if="hasChildren" class="menu-button__arrow">
        <component :is="expanded ? ArrowDown : ArrowRight" />
      </ElIcon>
    </button>

    <div v-if="hasChildren && expanded" class="menu-children">
      <SidebarMenuNode
        v-for="child in menu.children"
        :key="child.name"
        :is-expanded="isExpanded"
        :menu="child"
        :level="level + 1"
        :open-keys="openKeys"
        :toggle-level="toggleLevel"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-node {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: var(--app-text-muted);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    color: var(--app-text-primary);
    border-color: rgb(96 165 250 / 16%);
    background: var(--app-card-hover);
  }
}

.menu-button__main {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.menu-button__icon {
  font-size: 15px;
}

.menu-button__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

.menu-button__arrow {
  color: var(--app-text-subtle);
  font-size: 13px;
}

.menu-button--active {
  color: var(--app-text-primary);
  border-color: rgb(148 163 184 / 14%);
  background: var(--app-card-active);
}

.menu-button--branch-open {
  .menu-button__arrow {
    color: var(--app-text-secondary);
  }
}

.menu-node--level-0 > .menu-button {
  min-height: 42px;
  padding: 0 12px;
  border-radius: 13px;

  .menu-button__label {
    font-size: 15px;
    font-weight: 600;
  }
}

.menu-node--level-1 > .menu-button {
  padding-left: 18px;
}

.menu-node--level-2 > .menu-button {
  min-height: 36px;
  padding-left: 34px;

  .menu-button__label {
    font-size: 13px;
  }
}

.menu-children {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
