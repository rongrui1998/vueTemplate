<template>
  <div class="error-state">
    <span>Route Missing</span>
    <h1>当前菜单映射的页面文件不存在</h1>
    <p>请检查后端返回的 component 字段是否能对应到 `src/views/**/*.vue`。</p>
  </div>
</template>

<style scoped lang="scss">
.error-state {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #f8fafc;

  span {
    color: #f87171;
    font-size: 22px;
    font-weight: 700;
  }

  p {
    color: #94a3b8;
  }
}
</style>
