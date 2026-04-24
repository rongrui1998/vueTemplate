<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const crumbs = computed(() =>
  route.matched.filter((item) => item.meta?.title && item.name !== 'Root' && !item.meta.hidden),
)
</script>

<template>
  <div class="flex items-center gap-2 text-sm text-slate-400">
    <span class="text-slate-500">概览</span>
    <template v-for="item in crumbs" :key="item.path">
      <span class="text-slate-600">/</span>
      <span class="font-medium text-slate-200">
        {{ item.meta.title }}
      </span>
    </template>
  </div>
</template>
