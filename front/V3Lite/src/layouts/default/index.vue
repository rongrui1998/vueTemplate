<script setup lang="ts">
import { computed } from 'vue'

import AppHeader from '@/layouts/components/AppHeader.vue'
import AppSidebar from '@/layouts/components/AppSidebar.vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

const sidebarCollapsed = computed(() => layoutStore.sidebarCollapsed)
</script>

<template>
  <div class="layout-shell" :class="{ 'layout-shell--sidebar-collapsed': sidebarCollapsed }">
    <AppSidebar :collapsed="sidebarCollapsed" class="layout-shell__sidebar" />

    <div class="layout-shell__body">
      <AppHeader />

      <main class="layout-shell__content">
        <div class="layout-shell__panel">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-shell {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--app-layout-bg);
  transition: grid-template-columns 0.2s ease;
}

.layout-shell--sidebar-collapsed {
  grid-template-columns: 0 minmax(0, 1fr);
}

.layout-shell__sidebar {
  position: sticky;
  top: 0;
  min-width: 0;
  overflow: hidden;
}

.layout-shell__body {
  display: flex;
  grid-column: 2;
  min-width: 0;
  flex-direction: column;
}

.layout-shell__content {
  flex: 1;
  padding: 14px 16px 18px;
}

.layout-shell__panel {
  min-height: calc(100vh - 118px);
  border: 1px solid var(--app-panel-border);
  border-radius: 18px;
  background: var(--app-panel-bg);
  box-shadow: var(--app-panel-shadow);
}

@media (width <= 1024px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-shell__body {
    grid-column: auto;
  }

  .layout-shell__sidebar {
    display: none;
  }
}
</style>
