<template>
  <section class="app-page menu-demo-page">
    <div class="app-panel menu-demo-page__intro">
      <p class="app-page-eyebrow">Nested Menu Demo</p>
      <h1 class="app-page-title">这个页面专门用来验证二级菜单的展开和收起效果。</h1>
      <span class="app-page-description"
        >后续这里可以替换成系统管理、菜单管理或更完整的层级权限示例。</span
      >
    </div>

    <div class="app-grid-2 menu-demo-page__grid">
      <article class="app-panel menu-demo-page__card">
        <strong class="menu-demo-page__card-title">更紧凑的尺寸</strong>
        <p>侧栏宽度、按钮尺寸、页头高度、标签间距都整体缩了一档，更接近 vben 的信息密度。</p>
      </article>
      <article class="app-panel menu-demo-page__card">
        <strong class="menu-demo-page__card-title">可折叠菜单</strong>
        <p>当前已经支持顶层和二级分组按需展开/关闭，活动路由会自动保持所在分支展开。</p>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.menu-demo-page__intro {
  .app-page-title {
    margin: 12px 0 0;
    font-size: 28px;
  }
}

.menu-demo-page__grid {
  p {
    margin: 10px 0 0;
    color: var(--app-text-muted);
    line-height: 1.7;
  }
}

.menu-demo-page__card-title {
  color: var(--app-text-primary);
  font-size: 16px;
}
</style>
