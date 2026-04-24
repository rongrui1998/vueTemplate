<template>
  <div class="error-state">
    <span>404</span>
    <h1>页面不存在或路由尚未注册</h1>
    <p>如果是动态菜单页面，后续会通过权限初始化链路自动注入。</p>
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
    color: #f59e0b;
    font-size: 54px;
    font-weight: 700;
  }

  p {
    color: #94a3b8;
  }
}
</style>
