<script setup lang="ts">
import { Bell, FullScreen, Search, Setting, Sunny, SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import AppBreadcrumb from './AppBreadcrumb.vue'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const permissionStore = usePermissionStore()
const userStore = useUserStore()

async function handleLogout() {
  userStore.logout()
  permissionStore.resetAccess(router)
  await router.replace('/login')
}
</script>

<template>
  <header class="header-shell">
    <div class="header-main">
      <div class="flex items-center gap-4">
        <button class="action-btn action-btn--ghost" type="button">
          <ElIcon><Search /></ElIcon>
        </button>
        <div>
          <AppBreadcrumb />
          <h2 class="mt-2 text-lg font-semibold text-slate-50">后台管理模板</h2>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button class="search-pill" type="button">
          <ElIcon><Search /></ElIcon>
          <span>搜索</span>
          <kbd>⌘ K</kbd>
        </button>
        <button class="action-btn" type="button">
          <ElIcon><Setting /></ElIcon>
        </button>
        <button class="action-btn" type="button">
          <ElIcon><Sunny /></ElIcon>
        </button>
        <button class="action-btn" type="button">
          <ElIcon><FullScreen /></ElIcon>
        </button>
        <button class="action-btn" type="button">
          <ElIcon><Bell /></ElIcon>
        </button>

        <div class="user-pill">
          <img :src="userStore.userInfo?.avatar" alt="avatar" />
          <div>
            <p>{{ userStore.userInfo?.nickname || '未登录' }}</p>
            <span>{{ userStore.userInfo?.roles?.[0] || 'guest' }}</span>
          </div>
          <button class="action-btn action-btn--ghost" type="button" @click="handleLogout">
            <ElIcon><SwitchButton /></ElIcon>
          </button>
        </div>
      </div>
    </div>

    <div class="header-tabs">
      <RouterLink
        v-for="item in permissionStore.flatLeafMenus"
        :key="item.name"
        :to="item.path"
        class="tab-chip"
        active-class="tab-chip--active"
      >
        {{ item.meta.title }}
      </RouterLink>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header-shell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgb(255 255 255 / 6%);
  background: rgb(9 13 22 / 82%);
  backdrop-filter: blur(18px);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.search-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 36px;
  border: 1px solid rgb(148 163 184 / 18%);
  border-radius: 999px;
  background: rgb(15 23 42 / 65%);
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

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgb(148 163 184 / 18%);
  border-radius: 10px;
  background: rgb(15 23 42 / 72%);
  color: #cbd5e1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: #f8fafc;
    border-color: rgb(96 165 250 / 35%);
    transform: translateY(-1px);
  }
}

.action-btn--ghost {
  background: transparent;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 3px 4px 3px 3px;
  border: 1px solid rgb(148 163 184 / 18%);
  border-radius: 999px;
  background: rgb(15 23 42 / 72%);

  img {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    object-fit: cover;
  }

  p {
    margin: 0;
    color: #f8fafc;
    font-size: 13px;
    font-weight: 600;
  }

  span {
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
  }
}

.header-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.tab-chip {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  padding: 8px 12px;
  border: 1px solid rgb(148 163 184 / 12%);
  border-radius: 12px;
  background: rgb(15 23 42 / 50%);
  color: #94a3b8;
  font-size: 13px;
  text-decoration: none;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: #f8fafc;
    border-color: rgb(96 165 250 / 28%);
  }
}

.tab-chip--active {
  color: #f8fafc;
  border-color: rgb(96 165 250 / 28%);
  background: linear-gradient(180deg, rgb(38 48 66) 0%, rgb(28 37 53) 100%);
}
</style>
