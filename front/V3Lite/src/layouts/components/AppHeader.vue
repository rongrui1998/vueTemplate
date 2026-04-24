<script setup lang="ts">
import {
  Bell,
  Close,
  CollectionTag,
  Compass,
  CopyDocument,
  DataAnalysis,
  Document,
  Fold,
  FullScreen,
  Grid,
  Operation,
  RefreshRight,
  Search,
  Setting,
  Sunny,
  Tickets,
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppBreadcrumb from './AppBreadcrumb.vue'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const userStore = useUserStore()

const topLeadingActions = [Fold, RefreshRight]
const topUtilityActions = [Setting, Sunny, CollectionTag, Compass, FullScreen, Bell]
const tabTrailingActions = [Grid, RefreshRight, CopyDocument]

const iconMap = {
  DataAnalysis,
  Document,
  Grid,
  Operation,
  Tickets,
}

const tabs = computed(() => tabsStore.items)

function resolveMenuIcon(icon?: string) {
  return icon ? (iconMap[icon as keyof typeof iconMap] ?? Document) : Document
}

async function handleCloseTab(path: string) {
  await tabsStore.closeTab({
    currentPath: route.path,
    path,
    router,
  })
}
</script>

<template>
  <header class="header-shell">
    <div class="header-main">
      <div class="header-leading">
        <button
          v-for="(icon, index) in topLeadingActions"
          :key="`leading-${index}`"
          class="toolbar-btn toolbar-btn--ghost"
          type="button"
        >
          <ElIcon><component :is="icon" /></ElIcon>
        </button>

        <div class="header-breadcrumb">
          <AppBreadcrumb />
        </div>
      </div>

      <div class="header-toolbar">
        <button class="search-pill" type="button">
          <ElIcon><Search /></ElIcon>
          <span>搜索</span>
          <kbd>⌘ K</kbd>
        </button>

        <button
          v-for="(icon, index) in topUtilityActions"
          :key="`utility-${index}`"
          class="toolbar-btn"
          type="button"
        >
          <ElIcon><component :is="icon" /></ElIcon>
        </button>

        <button class="avatar-btn" type="button">
          <img :src="userStore.userInfo?.avatar" alt="avatar" />
        </button>
      </div>
    </div>

    <div class="header-tabs">
      <div class="header-tabs__scroll">
        <RouterLink
          v-for="item in tabs"
          :key="item.name"
          :to="item.path"
          class="tab-link"
          active-class="tab-link--active"
        >
          <span class="tab-link__main">
            <ElIcon class="tab-link__menu-icon">
              <component :is="resolveMenuIcon(item.icon)" />
            </ElIcon>
            <span>{{ item.title }}</span>
          </span>

          <ElIcon v-if="item.affix" data-test="tab-affix" class="tab-link__meta-icon">
            <CollectionTag />
          </ElIcon>
          <button
            v-else
            type="button"
            data-test="tab-close"
            class="tab-close-btn"
            @click.prevent.stop="handleCloseTab(item.path)"
          >
            <ElIcon class="tab-link__meta-icon">
              <Close />
            </ElIcon>
          </button>
        </RouterLink>
      </div>

      <div class="header-tabs__actions">
        <button
          v-for="(icon, index) in tabTrailingActions"
          :key="`tab-action-${index}`"
          class="tab-action-btn"
          type="button"
        >
          <ElIcon><component :is="icon" /></ElIcon>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-shell {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgb(255 255 255 / 7%);
  background: linear-gradient(180deg, rgb(5 10 22 / 96%) 0%, rgb(7 12 24 / 96%) 100%);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 60px;
  padding: 10px 18px;
  border-bottom: 1px solid rgb(255 255 255 / 6%);
}

.header-leading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.header-breadcrumb {
  min-width: 0;
  margin-left: 6px;
}

.header-toolbar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
}

.search-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid rgb(148 163 184 / 18%);
  border-radius: 999px;
  background: rgb(21 30 49 / 88%);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #f8fafc;
    border-color: rgb(96 165 250 / 35%);
  }

  kbd {
    padding: 1px 7px;
    border-radius: 999px;
    background: rgb(30 41 59 / 90%);
    font-size: 11px;
    color: #e2e8f0;
  }
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    color: #f8fafc;
    opacity: 1;
  }
}

.toolbar-btn--ghost {
  color: #e2e8f0;
}

.avatar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid rgb(255 255 255 / 10%);
  border-radius: 999px;
  background: rgb(30 41 59 / 78%);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    object-fit: cover;
  }
}

.header-tabs {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  min-height: 36px;
  border-top: 1px solid rgb(255 255 255 / 2%);
}

.header-tabs__scroll {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: stretch;
  overflow-x: auto;
}

.header-tabs__actions {
  display: flex;
  flex-shrink: 0;
  align-items: stretch;
  border-left: 1px solid rgb(255 255 255 / 8%);
}

.tab-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: max-content;
  padding: 0 16px;
  border-right: 1px solid rgb(255 255 255 / 8%);
  background: transparent;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1;
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: #f8fafc;
    background: rgb(18 25 42 / 72%);
  }
}

.tab-link__main {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.tab-link__menu-icon,
.tab-link__meta-icon {
  font-size: 13px;
}

.tab-link__meta-icon {
  color: #9aa6bc;
}

.tab-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.tab-link--active {
  color: #f8fafc;
  background: linear-gradient(180deg, rgb(42 52 74) 0%, rgb(35 45 67) 100%);
}

.tab-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  border: 0;
  border-left: 1px solid rgb(255 255 255 / 8%);
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: #f8fafc;
    background: rgb(19 27 43 / 86%);
  }
}

@media (width <= 1200px) {
  .header-toolbar {
    gap: 8px;
  }

  .search-pill span {
    display: none;
  }
}

@media (width <= 960px) {
  .header-main {
    flex-wrap: wrap;
    padding-bottom: 12px;
  }

  .header-toolbar {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
