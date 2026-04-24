<script setup lang="ts">
import { Briefcase, DataAnalysis, Grid, Monitor, Operation, Tickets } from '@element-plus/icons-vue'
import { computed } from 'vue'
import type { Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { usePermissionStore } from '@/stores/permission'

const iconMap: Record<string, Component> = {
  Briefcase,
  DataAnalysis,
  Grid,
  Monitor,
  Operation,
  Tickets,
}

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const menus = computed(() => permissionStore.menuTree)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function resolveIcon(icon?: string) {
  return (icon && iconMap[icon]) || Monitor
}

function navigate(path: string) {
  void router.push(path)
}
</script>

<template>
  <aside class="sidebar-shell">
    <div class="sidebar-brand">
      <div class="brand-mark">
        <span />
        <span />
      </div>
      <div>
        <p class="brand-title">V3 Lite Admin</p>
        <p class="brand-subtitle">Vue Admin Template</p>
      </div>
    </div>

    <div class="sidebar-menu">
      <section v-for="menu in menus" :key="menu.name" class="menu-group">
        <div class="menu-group__title">
          <ElIcon>
            <component :is="resolveIcon(menu.meta.icon)" />
          </ElIcon>
          <span>{{ menu.meta.title }}</span>
        </div>

        <button
          v-for="child in menu.children"
          :key="child.name"
          class="menu-item"
          :class="{ 'menu-item--active': isActive(child.path) }"
          type="button"
          @click="navigate(child.path)"
        >
          <ElIcon class="menu-item__icon">
            <component :is="resolveIcon(child.meta.icon)" />
          </ElIcon>
          <span>{{ child.meta.title }}</span>
        </button>
      </section>
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
  gap: 20px;
  padding: 20px 16px;
  border-right: 1px solid rgb(255 255 255 / 8%);
  background: linear-gradient(180deg, rgb(11 15 25) 0%, rgb(13 18 30) 100%), rgb(10 13 20);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 10px 18px;
}

.brand-mark {
  position: relative;
  width: 36px;
  height: 36px;

  span {
    position: absolute;
    inset: 0;
    border-radius: 12px;
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
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
}

.brand-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
}

.sidebar-menu {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-group__title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 600;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #f8fafc;
    border-color: rgb(59 130 246 / 24%);
    background: rgb(30 41 59 / 55%);
    transform: translateX(2px);
  }
}

.menu-item--active {
  color: #f8fafc;
  border-color: rgb(148 163 184 / 18%);
  background: linear-gradient(180deg, rgb(33 41 57) 0%, rgb(26 33 47) 100%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 4%);
}

.menu-item__icon {
  color: inherit;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgb(15 23 42 / 80%);
  color: #94a3b8;
  font-size: 13px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 16px rgb(34 197 94 / 80%);
}
</style>
