<script setup lang="ts">
import AppHeader from '@/layouts/components/AppHeader.vue'
import AppSidebar from '@/layouts/components/AppSidebar.vue'
</script>

<template>
  <div class="layout-shell">
    <AppSidebar class="layout-shell__sidebar" />

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
  background: #050816;
}

.layout-shell__sidebar {
  position: sticky;
  top: 0;
}

.layout-shell__body {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.layout-shell__content {
  flex: 1;
  padding: 14px 16px 18px;
}

.layout-shell__panel {
  min-height: calc(100vh - 118px);
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 18px;
  background: linear-gradient(180deg, rgb(12 17 29) 0%, rgb(8 12 22) 100%);
  box-shadow:
    0 18px 42px rgb(2 6 23 / 45%),
    inset 0 1px 0 rgb(255 255 255 / 4%);
}

@media (width <= 1024px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-shell__sidebar {
    display: none;
  }
}
</style>
