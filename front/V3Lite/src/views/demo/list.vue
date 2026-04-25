<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { fetchDemoRecordsApi } from '@/api/demo'
import { usePermission } from '@/composables/use-permission'
import type { DemoRecord } from '@/api/demo'

const { hasPermission } = usePermission()

const allRows = ref<DemoRecord[]>([])
const tableLoading = ref(false)

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

async function loadRows() {
  tableLoading.value = true

  try {
    allRows.value = await fetchDemoRecordsApi()
  } finally {
    tableLoading.value = false
  }
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

onMounted(() => {
  void loadRows()
})
</script>

<template>
  <section class="app-page demo-page">
    <div class="app-page-header demo-header">
      <div>
        <p class="app-page-eyebrow">Demo List</p>
        <h1 class="app-page-title">标准后台列表页的第一版范式已经接上。</h1>
        <span class="app-page-description"
          >查询区、表格区、分页和新增弹窗已经具备，后面再继续补编辑、删除和字典联动。</span
        >
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

    <section data-testid="query-panel" class="app-panel panel-shell query-shell">
      <div class="query-shell__header">
        <div>
          <p class="app-panel-title">筛选条件</p>
          <span class="app-panel-description"
            >按关键词和状态快速缩小结果范围，适合标准后台列表页的查询区模板。</span
          >
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

    <section class="app-panel app-table-panel panel-shell table-shell">
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

      <ElTable v-loading="tableLoading" :data="pagedRows">
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
.demo-header {
  .app-page-title {
    margin: 10px 0 0;
    font-size: 24px;
  }
}

.create-record-btn {
  min-width: 118px;
  height: 42px;
  border-color: var(--app-button-primary-border);
  border-radius: 12px;
  background: var(--app-button-primary-bg);
  box-shadow:
    0 12px 24px rgb(37 99 235 / 16%),
    inset 0 1px 0 rgb(255 255 255 / 18%);
  color: var(--app-button-primary-text);
  font-weight: 600;
}

.panel-shell {
  padding: 16px;
  border-radius: 16px;
}

.query-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.query-shell__header {
  .app-panel-description {
    max-width: 56ch;
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
  border-color: var(--app-button-primary-border);
  background: var(--app-button-primary-bg);
  box-shadow:
    0 10px 24px rgb(37 99 235 / 18%),
    inset 0 1px 0 rgb(255 255 255 / 16%);
  color: var(--app-button-primary-text);
}

:deep(.query-button--primary:hover) {
  border-color: var(--app-button-primary-border-hover);
  background: var(--app-button-primary-bg-hover);
  color: var(--app-button-primary-text);
}

:deep(.query-button--secondary) {
  border-color: var(--app-button-secondary-border);
  background: var(--app-button-secondary-bg);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
  color: var(--app-button-secondary-text);
}

:deep(.query-button--secondary:hover) {
  border-color: var(--app-button-secondary-border-hover);
  background: var(--app-button-secondary-bg-hover);
  color: var(--app-text-primary);
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 2px 2px 0;

  p {
    margin: 0;
    color: var(--app-text-subtle);
    font-size: 12px;
  }
}

.table-toolbar__summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-toolbar__hint {
  color: var(--app-text-subtle);
  font-size: 12px;
}

.result-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--app-panel-border);
  border-radius: 999px;
  background: var(--app-chip-bg);

  strong {
    color: var(--app-text-primary);
    font-size: 18px;
    line-height: 1;
  }

  span {
    color: var(--app-text-muted);
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
  --el-pagination-button-color: var(--app-text-secondary);
  --el-pagination-button-disabled-bg-color: var(--app-input-bg);
  --el-pagination-button-disabled-color: var(--app-text-subtle);
  --el-pagination-hover-color: var(--app-text-primary);

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
  border: 1px solid var(--app-table-border);
  border-radius: 10px;
  background: var(--app-button-secondary-bg);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  color: var(--app-text-secondary);
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
  border-color: var(--app-button-secondary-border-hover);
  color: var(--app-text-primary);
  background: var(--app-button-secondary-bg-hover);
}

:deep(.demo-pagination.is-background .btn-prev),
:deep(.demo-pagination.is-background .btn-next),
:deep(.demo-pagination.is-background .el-pager li) {
  background: var(--app-button-secondary-bg);
}

:deep(.demo-pagination .el-pager li.is-active) {
  border-color: var(--app-button-primary-border);
  background: var(--app-button-primary-bg);
  box-shadow: 0 8px 18px rgb(37 99 235 / 16%);
  color: var(--app-button-primary-text);
}

:deep(.demo-pagination .btn-prev:disabled),
:deep(.demo-pagination .btn-next:disabled) {
  border-color: var(--app-table-border);
  background: var(--app-input-bg);
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
  background: var(--app-input-bg);
  box-shadow: inset 0 0 0 1px var(--app-input-border);
}

:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover) {
  box-shadow: inset 0 0 0 1px var(--app-input-border-hover);
}

:deep(.el-input__inner),
:deep(.el-select__placeholder),
:deep(.el-select__selected-item),
:deep(.el-textarea__inner) {
  color: var(--app-text-secondary);
}

:deep(.el-input__inner::placeholder),
:deep(.el-textarea__inner::placeholder) {
  color: var(--app-text-subtle);
}

:deep(.el-select__caret),
:deep(.el-input__icon) {
  color: var(--app-text-subtle);
}

:deep(.el-table) {
  --el-table-bg-color: var(--app-table-bg);
  --el-table-tr-bg-color: transparent;
  --el-table-border-color: var(--app-table-border);
  --el-table-header-bg-color: var(--app-table-header-bg);
  --el-table-text-color: var(--app-text-secondary);
  --el-table-header-text-color: var(--app-text-muted);
  --el-table-row-hover-bg-color: var(--app-table-row-hover);

  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  padding: 14px 0;
  color: var(--app-text-muted);
  font-size: 13px;
  font-weight: 600;
}

:deep(.el-table td.el-table__cell) {
  padding: 18px 0;
}

:deep(.el-table .el-table__row:nth-child(even) td.el-table__cell) {
  background: var(--app-table-row-alt);
}

:deep(.el-dialog) {
  border: 1px solid var(--app-dialog-border);
  border-radius: 18px;
  background: var(--app-dialog-bg);
}

:deep(.el-dialog__header),
:deep(.el-dialog__body),
:deep(.el-dialog__footer) {
  background: transparent;
}

:deep(.el-dialog__title) {
  color: var(--app-text-primary);
}

:deep(.el-form-item__label) {
  color: var(--app-text-secondary);
}

:deep(.dialog-footer .el-button) {
  min-width: 96px;
  height: 40px;
  border-radius: 12px;
}

:deep(.dialog-footer .el-button:not(.el-button--primary)) {
  border-color: var(--app-button-secondary-border);
  background: var(--app-button-secondary-bg);
  color: var(--app-button-secondary-text);
}

:deep(.dialog-footer .el-button:not(.el-button--primary):hover) {
  border-color: var(--app-button-secondary-border-hover);
  background: var(--app-button-secondary-bg-hover);
  color: var(--app-text-primary);
}

:deep(.dialog-footer .el-button--primary) {
  border-color: var(--app-button-primary-border);
  background: var(--app-button-primary-bg);
  color: var(--app-button-primary-text);
}

:deep(.dialog-footer .el-button--primary:hover) {
  border-color: var(--app-button-primary-border-hover);
  background: var(--app-button-primary-bg-hover);
  color: var(--app-button-primary-text);
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
