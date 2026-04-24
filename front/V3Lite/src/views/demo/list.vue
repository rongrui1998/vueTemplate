<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import { usePermission } from '@/composables/use-permission'

interface DemoRecord {
  id: string
  name: string
  owner: string
  status: '进行中' | '待确认' | '已完成'
}

const { hasPermission } = usePermission()

const allRows = ref<DemoRecord[]>([
  { id: 'D-1001', name: '模板权限演示', owner: 'Admin', status: '进行中' },
  { id: 'D-1002', name: '列表页规范草稿', owner: 'Taylor', status: '待确认' },
  { id: 'D-1003', name: '动态菜单联调', owner: 'Jordan', status: '已完成' },
  { id: 'D-1004', name: '登录页视觉压缩', owner: 'Admin', status: '进行中' },
  { id: 'D-1005', name: '布局密度校准', owner: 'Taylor', status: '待确认' },
])

const filters = reactive({
  keyword: '',
  status: '',
})

const appliedFilters = reactive({
  keyword: '',
  status: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 4,
})

const dialogVisible = ref(false)
const form = reactive<Omit<DemoRecord, 'id'>>({
  name: '',
  owner: '',
  status: '进行中',
})

const statusOptions = ['全部', '进行中', '待确认', '已完成']

const canCreate = computed(() => hasPermission('demo:create'))

const filteredRows = computed(() => {
  return allRows.value.filter((row) => {
    const matchKeyword =
      !appliedFilters.keyword ||
      row.name.includes(appliedFilters.keyword) ||
      row.owner.toLowerCase().includes(appliedFilters.keyword.toLowerCase())
    const matchStatus = !appliedFilters.status || row.status === appliedFilters.status

    return matchKeyword && matchStatus
  })
})

const pagedRows = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredRows.value.slice(start, start + pagination.pageSize)
})

function applyFilters() {
  appliedFilters.keyword = filters.keyword.trim()
  appliedFilters.status = filters.status === '全部' ? '' : filters.status
  pagination.page = 1
}

function resetFilters() {
  filters.keyword = ''
  filters.status = ''
  appliedFilters.keyword = ''
  appliedFilters.status = ''
  pagination.page = 1
}

function openCreateDialog() {
  form.name = ''
  form.owner = ''
  form.status = '进行中'
  dialogVisible.value = true
}

function submitForm() {
  const nextId = `D-${String(1000 + allRows.value.length + 1)}`
  allRows.value = [
    {
      id: nextId,
      ...form,
    },
    ...allRows.value,
  ]
  dialogVisible.value = false
  pagination.page = 1
}
</script>

<template>
  <section class="demo-page">
    <div class="demo-header">
      <div>
        <p>Demo List</p>
        <h1>标准后台列表页的第一版范式已经接上。</h1>
        <span>查询区、表格区、分页和新增弹窗已经具备，后面再继续补编辑、删除和字典联动。</span>
      </div>
      <ElButton
        v-if="canCreate"
        data-testid="create-button"
        type="primary"
        @click="openCreateDialog"
      >
        新增记录
      </ElButton>
    </div>

    <section class="panel-shell">
      <div class="query-grid">
        <div data-testid="keyword-input">
          <ElInput v-model="filters.keyword" placeholder="搜索名称或负责人" clearable />
        </div>
        <ElSelect v-model="filters.status" placeholder="全部状态" clearable>
          <ElOption v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </ElSelect>
        <div class="query-actions">
          <ElButton data-testid="search-button" type="primary" plain @click="applyFilters">
            查询
          </ElButton>
          <ElButton @click="resetFilters">重置</ElButton>
        </div>
      </div>
    </section>

    <section class="panel-shell">
      <div class="table-toolbar">
        <div>
          <strong>{{ filteredRows.length }}</strong>
          <span>条结果</span>
        </div>
        <p>适合作为系统管理、用户管理等列表页基础模板</p>
      </div>

      <ElTable :data="pagedRows">
        <ElTableColumn prop="id" label="编号" min-width="120" />
        <ElTableColumn prop="name" label="名称" min-width="220" />
        <ElTableColumn prop="owner" label="负责人" min-width="120" />
        <ElTableColumn label="状态" min-width="120">
          <template #default="{ row }">
            <span class="status-pill" :class="`status-pill--${row.status}`">{{ row.status }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" min-width="160" fixed="right">
          <template #default>
            <div class="table-actions">
              <ElButton text type="primary">编辑</ElButton>
              <ElButton v-permission="'demo:create'" text type="warning">更多操作</ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="table-pagination">
        <ElPagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          layout="prev, pager, next"
          :total="filteredRows.length"
        />
      </div>
    </section>

    <ElDialog v-model="dialogVisible" title="新增记录" width="480px">
      <ElForm label-position="top">
        <ElFormItem label="名称">
          <ElInput v-model="form.name" placeholder="请输入记录名称" />
        </ElFormItem>
        <ElFormItem label="负责人">
          <ElInput v-model="form.owner" placeholder="请输入负责人" />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="form.status">
            <ElOption
              v-for="item in statusOptions.slice(1)"
              :key="item"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="submitForm">保存</ElButton>
        </div>
      </template>
    </ElDialog>
  </section>
</template>

<style scoped lang="scss">
.demo-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  p {
    margin: 0;
    color: #60a5fa;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 10px 0 0;
    color: #f8fafc;
    font-size: 24px;
    line-height: 1.35;
  }

  span {
    display: inline-block;
    margin-top: 10px;
    color: #94a3b8;
    line-height: 1.7;
  }
}

.panel-shell {
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 16px;
  background: rgb(12 18 30 / 92%);
}

.query-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 180px auto;
  gap: 12px;
  align-items: center;
}

.query-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;

  div {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  strong {
    color: #f8fafc;
    font-size: 28px;
    line-height: 1;
  }

  span,
  p {
    margin: 0;
    color: #94a3b8;
  }
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-pill--进行中 {
  background: rgb(59 130 246 / 18%);
  color: #93c5fd;
}

.status-pill--待确认 {
  background: rgb(245 158 11 / 18%);
  color: #fcd34d;
}

.status-pill--已完成 {
  background: rgb(34 197 94 / 18%);
  color: #86efac;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 38px;
  border-radius: 12px;
  background: rgb(15 23 42 / 88%);
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 14%);
}

:deep(.el-table) {
  --el-table-bg-color: rgb(15 23 42 / 92%);
  --el-table-tr-bg-color: transparent;
  --el-table-border-color: rgb(148 163 184 / 12%);
  --el-table-header-bg-color: rgb(30 41 59 / 85%);
  --el-table-text-color: #e2e8f0;
  --el-table-row-hover-bg-color: rgb(30 41 59 / 72%);

  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog) {
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 18px;
  background: rgb(10 15 26 / 98%);
}

:deep(.el-dialog__title) {
  color: #f8fafc;
}

:deep(.el-form-item__label) {
  color: #cbd5e1;
}

@media (width <= 1024px) {
  .query-grid {
    grid-template-columns: 1fr;
  }

  .query-actions,
  .table-toolbar {
    justify-content: flex-start;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
