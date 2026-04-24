<template>
  <div class="error-state">
    <span>403</span>
    <h1>当前账号没有访问权限</h1>
    <p>下一批会把页面守卫和按钮权限一起收口到统一规则里。</p>
  </div>
</template>

<style scoped lang="scss">
.error-state {
  display: flex;
  min-height: 420px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #f8fafc;

  span {
    color: #60a5fa;
    font-size: 54px;
    font-weight: 700;
  }

  p {
    color: #94a3b8;
  }
}
</style>
