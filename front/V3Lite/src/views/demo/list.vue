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
        class="create-record-btn"
        type="primary"
        @click="openCreateDialog"
      >
        新增记录
      </ElButton>
    </div>

    <section data-testid="query-panel" class="panel-shell query-shell">
      <div class="query-shell__header">
        <div>
          <p>筛选条件</p>
          <span>按关键词和状态快速缩小结果范围，适合标准后台列表页的查询区模板。</span>
        </div>
      </div>

      <div class="query-grid">
        <div data-testid="keyword-input">
          <ElInput v-model="filters.keyword" placeholder="搜索名称或负责人" clearable />
        </div>
        <ElSelect v-model="filters.status" placeholder="全部状态" clearable>
          <ElOption v-for="item in statusOptions" :key="item" :label="item" :value="item" />
        </ElSelect>
        <div class="query-actions">
          <ElButton
            data-testid="search-button"
            class="query-button query-button--primary"
            type="primary"
            @click="applyFilters"
          >
            查询
          </ElButton>
          <ElButton
            data-testid="reset-button"
            class="query-button query-button--secondary"
            @click="resetFilters"
          >
            重置
          </ElButton>
        </div>
      </div>
    </section>

    <section class="panel-shell table-shell">
      <div class="table-toolbar">
        <div class="table-toolbar__summary">
          <div data-testid="result-chip" class="result-chip">
            <strong>{{ filteredRows.length }}</strong>
            <span>条结果</span>
          </div>
          <span class="table-toolbar__hint">支持后续扩成系统管理、用户管理等标准后台列表页</span>
        </div>
        <p>最近更新时间：今天</p>
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
              <button data-testid="edit-action" type="button" class="table-action-link">
                编辑
              </button>
              <button
                v-permission="'demo:create'"
                type="button"
                class="table-action-link table-action-link--accent"
              >
                更多操作
              </button>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>

      <div data-testid="table-pagination" class="table-pagination">
        <ElPagination
          v-model:current-page="pagination.page"
          class="demo-pagination"
          background
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

.create-record-btn {
  min-width: 118px;
  height: 42px;
  border-color: rgb(59 130 246 / 60%);
  border-radius: 12px;
  background: linear-gradient(180deg, rgb(55 125 231) 0%, rgb(40 96 194) 100%);
  box-shadow:
    0 12px 24px rgb(37 99 235 / 16%),
    inset 0 1px 0 rgb(255 255 255 / 18%);
  font-weight: 600;
}

.panel-shell {
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 16px;
  background: rgb(12 18 30 / 92%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 2%);
}

.query-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.query-shell__header {
  p {
    margin: 0;
    color: #e2e8f0;
    font-size: 14px;
    font-weight: 600;
  }

  span {
    display: inline-block;
    margin-top: 6px;
    color: #64748b;
    font-size: 12px;
    line-height: 1.7;
  }
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

.table-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

:deep(.query-button) {
  min-width: 104px;
  height: 42px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.query-button--primary) {
  border-color: rgb(59 130 246 / 58%);
  background: linear-gradient(180deg, rgb(55 125 231) 0%, rgb(40 96 194) 100%);
  box-shadow:
    0 10px 24px rgb(37 99 235 / 18%),
    inset 0 1px 0 rgb(255 255 255 / 16%);
  color: #eff6ff;
}

:deep(.query-button--primary:hover) {
  border-color: rgb(96 165 250 / 72%);
  background: linear-gradient(180deg, rgb(69 137 241) 0%, rgb(47 108 212) 100%);
  color: #fff;
}

:deep(.query-button--secondary) {
  border-color: rgb(71 85 105 / 42%);
  background: linear-gradient(180deg, rgb(28 38 56) 0%, rgb(20 29 44) 100%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
  color: #cbd5e1;
}

:deep(.query-button--secondary:hover) {
  border-color: rgb(96 165 250 / 28%);
  background: linear-gradient(180deg, rgb(33 45 66) 0%, rgb(24 34 52) 100%);
  color: #f8fafc;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 2px 2px 0;

  p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }
}

.table-toolbar__summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-toolbar__hint {
  color: #64748b;
  font-size: 12px;
}

.result-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid rgb(96 165 250 / 14%);
  border-radius: 999px;
  background: rgb(18 30 49 / 78%);

  strong {
    color: #f8fafc;
    font-size: 18px;
    line-height: 1;
  }

  span {
    color: #94a3b8;
    font-size: 12px;
  }
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 2px;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.table-action-link {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #4ea1ff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    color: #7cc0ff;
  }
}

.table-action-link--accent {
  color: #ffbf47;

  &:hover {
    color: #ffd277;
  }
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

:deep(.demo-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-button-color: #cbd5e1;
  --el-pagination-button-disabled-bg-color: rgb(15 23 42 / 46%);
  --el-pagination-button-disabled-color: #64748b;
  --el-pagination-hover-color: #f8fafc;

  display: inline-flex;
  align-items: center;
  gap: 8px;
}

:deep(.demo-pagination .btn-prev),
:deep(.demo-pagination .btn-next),
:deep(.demo-pagination .el-pager li) {
  min-width: 38px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid rgb(148 163 184 / 14%);
  border-radius: 10px;
  background: linear-gradient(180deg, rgb(20 28 44) 0%, rgb(15 22 36) 100%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  color: #cbd5e1;
  font-weight: 600;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

:deep(.demo-pagination .btn-prev:hover),
:deep(.demo-pagination .btn-next:hover),
:deep(.demo-pagination .el-pager li:hover) {
  border-color: rgb(96 165 250 / 30%);
  color: #f8fafc;
  background: linear-gradient(180deg, rgb(25 36 58) 0%, rgb(18 28 45) 100%);
}

:deep(.demo-pagination.is-background .btn-prev),
:deep(.demo-pagination.is-background .btn-next),
:deep(.demo-pagination.is-background .el-pager li) {
  background: linear-gradient(180deg, rgb(20 28 44) 0%, rgb(15 22 36) 100%);
}

:deep(.demo-pagination .el-pager li.is-active) {
  border-color: rgb(96 165 250 / 48%);
  background: linear-gradient(180deg, rgb(39 94 179) 0%, rgb(31 77 149) 100%);
  box-shadow: 0 8px 18px rgb(37 99 235 / 16%);
  color: #eff6ff;
}

:deep(.demo-pagination .btn-prev:disabled),
:deep(.demo-pagination .btn-next:disabled) {
  border-color: rgb(71 85 105 / 18%);
  background: rgb(15 23 42 / 48%);
  box-shadow: none;
}

:deep(.demo-pagination .btn-prev .el-icon),
:deep(.demo-pagination .btn-next .el-icon) {
  font-size: 13px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 42px;
  border-radius: 12px;
  background: rgb(15 23 42 / 88%);
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 14%);
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover) {
  box-shadow: inset 0 0 0 1px rgb(96 165 250 / 24%);
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

:deep(.el-table th.el-table__cell) {
  padding: 14px 0;
  color: #a8b4c8;
  font-size: 13px;
  font-weight: 600;
}

:deep(.el-table td.el-table__cell) {
  padding: 18px 0;
}

:deep(.el-table .el-table__row:nth-child(even) td.el-table__cell) {
  background: rgb(24 33 51 / 44%);
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

  .table-toolbar__summary {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
