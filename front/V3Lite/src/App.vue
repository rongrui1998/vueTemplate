<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

onMounted(async () => {
  if (!userStore.accessToken || permissionStore.routesReady) {
    return
  }

  await permissionStore.initializeAccess(router)

  if (route.name === 'Root') {
    await router.replace(permissionStore.homePath)
  }
})
</script>

<template>
  <RouterView />
</template>
