<script setup lang="ts">
import {
  Bell,
  Close,
  CollectionTag,
  CopyDocument,
  DataAnalysis,
  Document,
  Expand,
  Fold,
  FullScreen,
  Grid,
  Moon,
  Operation,
  RefreshRight,
  Sunny,
  Tickets,
} from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppBreadcrumb from './AppBreadcrumb.vue'
import { useLayoutStore } from '@/stores/layout'
import { useTabsStore } from '@/stores/tabs'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const layoutStore = useLayoutStore()
const tabsStore = useTabsStore()
const themeStore = useThemeStore()
const userStore = useUserStore()
const messagePanelOpen = ref(false)

const tabTrailingActions = [Grid, RefreshRight, CopyDocument]
const sidebarToggleIcon = computed(() => (layoutStore.sidebarCollapsed ? Expand : Fold))
const themeToggleIcon = computed(() => (themeStore.mode === 'dark' ? Sunny : Moon))
const messageItems = [
  {
    description: '菜单演示和表单演示已经同步到了最新权限树。',
    id: 'release',
    tag: '系统',
    time: '刚刚',
    title: '权限发布已完成',
    unread: true,
  },
  {
    description: '工作台概览卡片和列表页主题变量已经接入浅色模式。',
    id: 'theme',
    tag: '协作',
    time: '12 分钟前',
    title: '主题改造待你确认',
    unread: true,
  },
  {
    description: '你可以继续补充删除、字典联动和更多操作弹层。',
    id: 'todo',
    tag: '提醒',
    time: '今天',
    title: '列表页还有 3 个待办',
    unread: false,
  },
] as const
const unreadMessageCount = computed(() => messageItems.filter((item) => item.unread).length)

const iconMap = {
  DataAnalysis,
  Document,
  Grid,
  Operation,
  Tickets,
}

const tabs = computed(() => tabsStore.items)

const topLeadingActions = [
  {
    handler: handleReloadCurrentPage,
    icon: RefreshRight,
    testId: 'page-refresh',
  },
]

const topUtilityActions = computed(() => [
  {
    handler: handleToggleTheme,
    icon: themeToggleIcon.value,
    testId: 'theme-toggle',
  },
  {
    handler: handleToggleFullscreen,
    icon: FullScreen,
    testId: 'fullscreen-toggle',
  },
])

function resolveMenuIcon(icon?: string) {
  return icon ? (iconMap[icon as keyof typeof iconMap] ?? Document) : Document
}

function handleToggleSidebar() {
  layoutStore.toggleSidebar()
}

function handleReloadCurrentPage() {
  router.go(0)
}

function handleToggleTheme() {
  themeStore.toggleTheme()
}

function handleToggleMessages() {
  messagePanelOpen.value = !messagePanelOpen.value
}

async function handleToggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen?.()
    return
  }

  await document.documentElement.requestFullscreen?.()
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
          data-test="sidebar-toggle"
          class="toolbar-btn toolbar-btn--ghost"
          type="button"
          @click="handleToggleSidebar"
        >
          <ElIcon><component :is="sidebarToggleIcon" /></ElIcon>
        </button>

        <button
          v-for="(action, index) in topLeadingActions"
          :key="`leading-${index}`"
          :data-test="action.testId"
          class="toolbar-btn toolbar-btn--ghost"
          type="button"
          @click="action.handler"
        >
          <ElIcon><component :is="action.icon" /></ElIcon>
        </button>

        <div class="header-breadcrumb">
          <AppBreadcrumb />
        </div>
      </div>

      <div class="header-toolbar">
        <button
          v-for="(action, index) in topUtilityActions"
          :key="`utility-${index}`"
          :data-test="action.testId"
          class="toolbar-btn"
          type="button"
          @click="action.handler?.()"
        >
          <ElIcon><component :is="action.icon" /></ElIcon>
        </button>

        <div class="message-popover">
          <button
            data-test="message-toggle"
            class="toolbar-btn"
            type="button"
            @click="handleToggleMessages"
          >
            <ElIcon><Bell /></ElIcon>
            <span v-if="unreadMessageCount > 0" class="toolbar-badge">
              {{ unreadMessageCount > 9 ? '9+' : unreadMessageCount }}
            </span>
          </button>

          <div v-if="messagePanelOpen" data-test="message-panel" class="message-panel">
            <div class="message-panel__header">
              <div>
                <strong>消息中心</strong>
                <p>最近需要你关注的更新都在这里。</p>
              </div>
              <span class="message-panel__count">{{ unreadMessageCount }} 条未读</span>
            </div>

            <div class="message-panel__list">
              <article
                v-for="message in messageItems"
                :key="message.id"
                data-test="message-item"
                class="message-item"
                :class="{ 'message-item--unread': message.unread }"
              >
                <div class="message-item__meta">
                  <span class="message-item__tag">{{ message.tag }}</span>
                  <span>{{ message.time }}</span>
                </div>
                <strong>{{ message.title }}</strong>
                <p>{{ message.description }}</p>
              </article>
            </div>

            <button type="button" class="message-panel__footer">查看全部消息</button>
          </div>
        </div>

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
  border-bottom: 1px solid var(--app-header-border);
  background: var(--app-header-bg);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 60px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--app-divider-color);
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
  position: relative;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: var(--app-text-secondary);
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: var(--app-text-primary);
    background: var(--app-toolbar-hover-bg);
    opacity: 1;
  }
}

.toolbar-btn--ghost {
  color: var(--app-button-ghost-color);
}

.message-popover {
  position: relative;
}

.toolbar-badge {
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 999px;
  background: var(--app-text-accent);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
}

.message-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: -12px;
  z-index: 20;
  width: 320px;
  padding: 14px;
  border: 1px solid var(--app-panel-border);
  border-radius: 18px;
  background: var(--app-card-bg);
  box-shadow: var(--app-panel-shadow);
}

.message-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--app-divider-color);

  strong {
    color: var(--app-text-primary);
    font-size: 15px;
  }

  p {
    margin: 6px 0 0;
    color: var(--app-text-subtle);
    font-size: 12px;
    line-height: 1.6;
  }
}

.message-panel__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--app-chip-bg);
  color: var(--app-text-accent);
  font-size: 12px;
  font-weight: 600;
}

.message-panel__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.message-item {
  padding: 12px;
  border: 1px solid var(--app-divider-color);
  border-radius: 14px;
  background: var(--app-card-bg-secondary);

  strong {
    display: block;
    margin-top: 8px;
    color: var(--app-text-primary);
    font-size: 14px;
  }

  p {
    margin: 6px 0 0;
    color: var(--app-text-muted);
    font-size: 12px;
    line-height: 1.7;
  }
}

.message-item--unread {
  border-color: rgb(96 165 250 / 24%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
}

.message-item__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--app-text-subtle);
  font-size: 11px;
}

.message-item__tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--app-chip-bg);
  color: var(--app-text-accent);
  font-weight: 600;
}

.message-panel__footer {
  width: 100%;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid var(--app-button-secondary-border);
  border-radius: 12px;
  background: var(--app-button-secondary-bg);
  color: var(--app-button-secondary-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: var(--app-button-secondary-border-hover);
    background: var(--app-button-secondary-bg-hover);
    color: var(--app-text-primary);
  }
}

.avatar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid var(--app-avatar-border);
  border-radius: 999px;
  background: var(--app-avatar-bg);
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
  border-top: 1px solid var(--app-divider-soft);
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
  border-left: 1px solid var(--app-sidebar-border);
}

.tab-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: max-content;
  padding: 0 16px;
  border-right: 1px solid var(--app-sidebar-border);
  background: transparent;
  color: var(--app-text-secondary);
  font-size: 12px;
  line-height: 1;
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: var(--app-text-primary);
    background: var(--app-tab-hover-bg);
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
  color: var(--app-text-muted);
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
  color: var(--app-text-primary);
  background: var(--app-tab-active-bg);
}

.tab-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  border: 0;
  border-left: 1px solid var(--app-sidebar-border);
  background: transparent;
  color: var(--app-text-muted);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: var(--app-text-primary);
    background: var(--app-tab-hover-bg);
  }
}

@media (width <= 1200px) {
  .header-toolbar {
    gap: 8px;
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

  .message-panel {
    right: 0;
  }
}
</style>
