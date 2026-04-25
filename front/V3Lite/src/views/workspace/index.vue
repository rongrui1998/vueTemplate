<script setup lang="ts">
const projects = [
  { name: '权限体系升级', status: '进行中', owner: '前端组', progress: '72%' },
  { name: '数据报表改造', status: '待排期', owner: '数据组', progress: '35%' },
  { name: '审批流重构', status: '已评审', owner: '中台组', progress: '88%' },
]

const timeline = [
  '统一收敛用户、角色、菜单关系模型',
  '接入前后端联调所需的 mock 权限链路',
  '沉淀列表页 / 表单页开发范式',
]
</script>

<template>
  <section class="app-page workspace-page">
    <div class="app-grid-2 workspace-grid">
      <article class="app-panel app-panel--feature workspace-card">
        <p class="app-page-eyebrow">Workspace</p>
        <h1 class="app-page-title">这里会作为项目总览页，承接快捷入口和协作状态。</h1>
        <span class="app-page-description"
          >当前先用静态内容把结构建立起来，后面再结合业务脚手架继续扩展。</span
        >
      </article>

      <article class="app-panel workspace-card">
        <p class="app-page-eyebrow">本周推进</p>
        <ul class="app-panel-list">
          <li v-for="item in timeline" :key="item">
            {{ item }}
          </li>
        </ul>
      </article>
    </div>

    <article class="app-panel app-table-panel workspace-table">
      <div class="app-table-head workspace-table__head">
        <h2>项目看板</h2>
        <span class="app-panel-meta">三条示例数据</span>
      </div>

      <div class="app-table-list workspace-table__list">
        <div v-for="project in projects" :key="project.name" class="app-table-row workspace-row">
          <strong>{{ project.name }}</strong>
          <span>{{ project.owner }}</span>
          <span>{{ project.status }}</span>
          <span>{{ project.progress }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.workspace-card {
  .app-page-title,
  .app-page-description {
    max-width: 24ch;
  }
}

.workspace-row {
  grid-template-columns: 2fr repeat(3, 1fr);
}

@media (width <= 1024px) {
  .workspace-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
