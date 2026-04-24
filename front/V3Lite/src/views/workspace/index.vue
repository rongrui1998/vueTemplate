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
  <section class="workspace-page">
    <div class="workspace-grid">
      <article class="workspace-card workspace-card--feature">
        <p>Workspace</p>
        <h1>这里会作为项目总览页，承接快捷入口和协作状态。</h1>
        <span>当前先用静态内容把结构建立起来，后面再结合业务脚手架继续扩展。</span>
      </article>

      <article class="workspace-card">
        <p>本周推进</p>
        <ul>
          <li v-for="item in timeline" :key="item">
            {{ item }}
          </li>
        </ul>
      </article>
    </div>

    <article class="workspace-table">
      <div class="workspace-table__head">
        <h2>项目看板</h2>
        <span>三条示例数据</span>
      </div>

      <div class="workspace-table__list">
        <div v-for="project in projects" :key="project.name" class="workspace-row">
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
.workspace-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.workspace-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 18px;
}

.workspace-card,
.workspace-table {
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 22px;
  background: rgb(12 18 30 / 92%);
}

.workspace-card {
  padding: 24px;

  p {
    margin: 0;
    color: #60a5fa;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 12px 0 0;
    color: #f8fafc;
    font-size: 30px;
    line-height: 1.35;
  }

  span {
    display: inline-block;
    margin-top: 14px;
    color: #94a3b8;
    line-height: 1.8;
  }

  ul {
    margin: 18px 0 0;
    padding-left: 18px;
    color: #cbd5e1;
    line-height: 2;
  }
}

.workspace-card--feature {
  background:
    radial-gradient(circle at top right, rgb(34 211 238 / 18%), transparent 20%),
    linear-gradient(180deg, rgb(17 24 39) 0%, rgb(12 18 30) 100%);
}

.workspace-table {
  padding: 24px;
}

.workspace-table__head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    color: #f8fafc;
  }

  span {
    color: #64748b;
  }
}

.workspace-table__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.workspace-row {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 12px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 16px;
  background: rgb(15 23 42 / 72%);
  color: #94a3b8;

  strong {
    color: #f8fafc;
  }
}

@media (width <= 1024px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .workspace-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
