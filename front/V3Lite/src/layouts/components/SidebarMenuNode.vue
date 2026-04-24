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
import { computed, ref, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { MenuItem } from '@/types/permission'

const props = withDefaults(
  defineProps<{
    level?: number
    menu: MenuItem
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
const activeBranch = computed(
  () => route.path === props.menu.path || route.path.startsWith(`${props.menu.path}/`),
)
const expanded = ref(false)

watch(
  activeBranch,
  (value) => {
    if (value) {
      expanded.value = true
    }
  },
  { immediate: true },
)

function resolveIcon(icon?: string) {
  return (icon && iconMap[icon]) || Monitor
}

function handleAction() {
  if (hasChildren.value) {
    expanded.value = !expanded.value
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
        'menu-button--active': isLeaf && activeBranch,
        'menu-button--branch-active': hasChildren && activeBranch,
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
        :menu="child"
        :level="level + 1"
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
  color: #8b9bb4;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    color: #eef4ff;
    border-color: rgb(96 165 250 / 16%);
    background: rgb(23 31 45 / 74%);
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
  color: #64748b;
  font-size: 13px;
}

.menu-button--active,
.menu-button--branch-open {
  color: #f8fafc;
  border-color: rgb(148 163 184 / 14%);
  background: linear-gradient(180deg, rgb(32 41 58) 0%, rgb(23 31 45) 100%);
}

.menu-button--branch-active {
  color: #dbeafe;
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
