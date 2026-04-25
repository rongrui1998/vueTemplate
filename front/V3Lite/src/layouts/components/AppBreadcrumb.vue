<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const crumbs = computed(() =>
  route.matched.filter((item) => item.meta?.title && item.name !== 'Root' && !item.meta.hidden),
)
</script>

<template>
  <div class="breadcrumb-shell">
    <template v-for="item in crumbs" :key="item.path">
      <span v-if="item !== crumbs[0]" class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item">
        {{ item.meta.title }}
      </span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb-shell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  color: var(--app-text-muted);
  font-size: 13px;
}

.breadcrumb-separator {
  color: var(--app-text-subtle);
  flex-shrink: 0;
}

.breadcrumb-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.breadcrumb-shell :last-child {
  color: var(--app-text-primary);
  font-weight: 600;
}
</style>
