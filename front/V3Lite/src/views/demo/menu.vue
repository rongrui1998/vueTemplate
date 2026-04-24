<template>
  <section class="menu-demo-page">
    <div class="menu-demo-page__intro">
      <p>Nested Menu Demo</p>
      <h1>这个页面专门用来验证二级菜单的展开和收起效果。</h1>
      <span>后续这里可以替换成系统管理、菜单管理或更完整的层级权限示例。</span>
    </div>

    <div class="menu-demo-page__grid">
      <article>
        <strong>更紧凑的尺寸</strong>
        <p>侧栏宽度、按钮尺寸、页头高度、标签间距都整体缩了一档，更接近 vben 的信息密度。</p>
      </article>
      <article>
        <strong>可折叠菜单</strong>
        <p>当前已经支持顶层和二级分组按需展开/关闭，活动路由会自动保持所在分支展开。</p>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.menu-demo-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
}

.menu-demo-page__intro,
.menu-demo-page__grid article {
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 18px;
  background: rgb(12 18 30 / 92%);
}

.menu-demo-page__intro {
  padding: 20px;

  p {
    margin: 0;
    color: #60a5fa;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 12px 0 0;
    color: #f8fafc;
    font-size: 28px;
    line-height: 1.35;
  }

  span {
    display: inline-block;
    margin-top: 12px;
    color: #94a3b8;
    line-height: 1.75;
  }
}

.menu-demo-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  article {
    padding: 18px;
  }

  strong {
    color: #f8fafc;
    font-size: 16px;
  }

  p {
    margin: 10px 0 0;
    color: #94a3b8;
    line-height: 1.7;
  }
}

@media (width <= 768px) {
  .menu-demo-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
