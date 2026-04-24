<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { appEnv } from '@/constants/env'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const form = reactive({
  password: 'admin123',
  username: 'admin',
})

async function handleLogin() {
  await userStore.login(form)
  await permissionStore.initializeAccess(router)
  await router.replace(permissionStore.homePath)
}
</script>

<template>
  <div class="login-shell">
    <section class="login-hero">
      <span class="login-badge">V3 Lite / Admin</span>
      <h1>面向后台项目的轻量模板，从这套底座开始稳定演进。</h1>
      <p>
        第一版先提供接近 vben
        的结构体验：暗色布局、动态菜单、权限链路和统一后台骨架，后续再把系统管理、标签页和更多工程化能力逐步补进来。
      </p>

      <div class="hero-grid">
        <div>
          <strong>动态菜单</strong>
          <span>登录后拉取菜单树与权限码</span>
        </div>
        <div>
          <strong>权限底座</strong>
          <span>统一收口到 store 和路由转换层</span>
        </div>
        <div>
          <strong>单应用结构</strong>
          <span>更适合团队快速开后台项目</span>
        </div>
      </div>
    </section>

    <section class="login-card">
      <div>
        <p class="login-card__eyebrow">欢迎回来</p>
        <h2>登录 {{ appEnv.title }}</h2>
        <p class="login-card__tips">演示账号：admin / admin123</p>
      </div>

      <ElForm label-position="top" @submit.prevent="handleLogin">
        <ElFormItem label="用户名">
          <ElInput v-model="form.username" size="large" placeholder="请输入用户名">
            <template #prefix>
              <ElIcon><User /></ElIcon>
            </template>
          </ElInput>
        </ElFormItem>

        <ElFormItem label="密码">
          <ElInput
            v-model="form.password"
            show-password
            size="large"
            type="password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <ElIcon><Lock /></ElIcon>
            </template>
          </ElInput>
        </ElFormItem>

        <ElButton
          class="mt-2"
          type="primary"
          size="large"
          :loading="userStore.loading"
          @click="handleLogin"
        >
          进入后台
        </ElButton>
      </ElForm>
    </section>
  </div>
</template>

<style scoped lang="scss">
.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 460px);
  min-height: 100vh;
  padding: 30px;
  gap: 24px;
  background:
    radial-gradient(circle at top left, rgb(59 130 246 / 24%), transparent 28%),
    radial-gradient(circle at bottom left, rgb(124 58 237 / 22%), transparent 26%),
    linear-gradient(135deg, #060816 0%, #0b1020 52%, #09111f 100%);
}

.login-hero,
.login-card {
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 28px;
  background: rgb(10 15 26 / 82%);
  backdrop-filter: blur(18px);
}

.login-hero {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 42px;

  h1 {
    margin: 18px 0 0;
    max-width: 720px;
    color: #f8fafc;
    font-size: clamp(40px, 6vw, 64px);
    line-height: 1.08;
  }

  p {
    max-width: 680px;
    margin: 18px 0 0;
    color: #94a3b8;
    font-size: 16px;
    line-height: 1.8;
  }
}

.login-badge {
  display: inline-flex;
  width: max-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgb(96 165 250 / 14%);
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 600;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 34px;

  div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border: 1px solid rgb(255 255 255 / 6%);
    border-radius: 18px;
    background: rgb(15 23 42 / 60%);
  }

  strong {
    color: #f8fafc;
  }

  span {
    color: #94a3b8;
    font-size: 13px;
    line-height: 1.6;
  }
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;

  h2 {
    margin: 10px 0 0;
    color: #f8fafc;
    font-size: 30px;
  }
}

.login-card__eyebrow {
  margin: 0;
  color: #60a5fa;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-card__tips {
  margin: 10px 0 24px;
  color: #94a3b8;
  line-height: 1.7;
}

:deep(.el-form-item__label) {
  color: #cbd5e1;
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 14px;
  background: rgb(15 23 42 / 88%);
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 16%);
}

:deep(.el-input__inner) {
  color: #f8fafc;
}

:deep(.el-button--primary) {
  width: 100%;
  min-height: 48px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
}

@media (width <= 1024px) {
  .login-shell {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .login-hero {
    min-height: 320px;
    padding: 28px;
  }

  .hero-grid {
    grid-template-columns: 1fr;
  }
}
</style>
