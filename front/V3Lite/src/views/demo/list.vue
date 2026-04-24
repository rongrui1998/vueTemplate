<script setup lang="ts">
const rows = [
  { id: 'D-1001', name: '模板权限演示', owner: 'Admin', status: '进行中' },
  { id: 'D-1002', name: '列表页规范草稿', owner: 'Taylor', status: '待确认' },
]
</script>

<template>
  <section class="demo-page">
    <div class="demo-header">
      <div>
        <p>Demo List</p>
        <h1>这里会在下一批继续扩成标准后台列表页。</h1>
      </div>
      <ElButton type="primary"> 新增记录 </ElButton>
    </div>

    <ElTable :data="rows">
      <ElTableColumn prop="id" label="编号" min-width="120" />
      <ElTableColumn prop="name" label="名称" min-width="220" />
      <ElTableColumn prop="owner" label="负责人" min-width="120" />
      <ElTableColumn prop="status" label="状态" min-width="120" />
    </ElTable>
  </section>
</template>

<style scoped lang="scss">
.demo-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  p {
    margin: 0;
    color: #60a5fa;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 10px 0 0;
    color: #f8fafc;
    font-size: 24px;
  }
}

:deep(.el-table) {
  --el-table-bg-color: rgb(15 23 42 / 92%);
  --el-table-tr-bg-color: transparent;
  --el-table-border-color: rgb(148 163 184 / 12%);
  --el-table-header-bg-color: rgb(30 41 59 / 85%);
  --el-table-text-color: #e2e8f0;
  --el-table-row-hover-bg-color: rgb(30 41 59 / 72%);

  border-radius: 18px;
  overflow: hidden;
}
</style>
