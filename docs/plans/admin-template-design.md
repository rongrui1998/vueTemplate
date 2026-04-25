# 后台管理前端模板设计方案

## 1. 背景

团队在开发后台管理系统时，重复进行项目初始化、登录接入、布局搭建、导航配置、权限守卫、请求封装等工作，成本高且风格不统一。目标是基于 `Vue 3 + TypeScript + TailwindCSS + Pinia + Element Plus` 设计一套可长期复用的后台管理模板，并参考 `vben-admin-pro` 的使用体验与常见后台系统实践，形成统一底座。

## 2. 总体目标

- 提供可直接开项目的后台单应用模板。
- 核心能力围绕登录、动态菜单、动态路由、权限控制、基础布局、请求封装展开。
- 模板分三层版本演进，避免一步到位做成重型框架。
- 优先服务真实后台开发场景，而不是做演示型脚手架。

## 3. 设计原则

- 单应用优先：本项目定位为单后台应用模板，不采用 monorepo。
- 渐进增强：按 `V3 Lite -> V2 Standard -> V1 Pro` 演进。
- 贴近真实后台：以“登录后获取菜单和权限并动态渲染”为基础能力。
- 控制复杂度：V3 先完成最常用底座，不预置用户/角色/菜单管理。
- 统一规范：目录、权限、请求、样式、页面结构尽量标准化。
- 可维护性优先：避免过早抽象和过度设计。

## 4. 技术选型

- 框架：`Vue 3`
- 语言：`TypeScript`
- 构建工具：`Vite`
- UI：`Element Plus`
- 样式：`TailwindCSS + scoped scss`
- 路由：`Vue Router`
- 状态管理：`Pinia`
- 请求：`Axios`
- 质量工具：`ESLint + Prettier + Stylelint`
- 提交规范：`Husky + lint-staged + commitlint`
- 提效插件：`unplugin-auto-import + unplugin-vue-components + vite-plugin-svg-icons`

## 5. 版本规划

### 5.1 V3 Lite

定位：最小可用后台模板，适合快速开新项目。

包含：

- 登录页
- 基础后台布局
- 顶部区域、侧边栏、基础导航体验
- 登录后获取菜单树和权限码
- 动态路由注册
- 路由守卫与基础权限守卫
- 请求封装
- 全局状态管理
- 基础异常页（`403`、`404`）
- 两个演示页：`Dashboard`、`Demo List`
- 本地 mock 能力，用于无后端时联调权限链路

不包含：

- 用户管理
- 角色管理
- 菜单管理
- 国际化
- 多租户
- 高级主题系统
- 代码生成和 AI 自动生成能力

### 5.2 V2 Standard

定位：覆盖大多数常规后台项目需求。

在 V3 基础上增加：

- 标签页导航
- 面包屑
- 页面缓存策略
- 字典能力
- 统一列表页范式
- 统一表单页范式
- 上传、导入导出预留
- 更完善的权限指令与权限组件
- 系统管理示例模块（可选）：用户、角色、菜单

### 5.3 V1 Pro

定位：团队级长期复用模板。

在 V2 基础上增加：

- 更完整的主题配置
- 国际化
- 多布局方案
- 表格列配置持久化
- Schema 化表单/列表配置
- 通知中心、全局搜索等增强能力
- 与 AI 协同开发有关的规范和自动化脚本

## 6. 工程结构

本项目采用单应用分层目录结构，避免 monorepo 带来的认知和维护成本。当前仓库中的 `V3 Lite` 实际落在 `front/V3Lite/` 目录下。

```text
front/
  V3Lite/
    mock/
    src/
      api/
        auth/
        demo/
      app/
        router/
      assets/
      components/
        common/
      composables/
      constants/
      directives/
      layouts/
        default/
        components/
      modules/
        auth/
      router/
        routes/
        transform/
      stores/
        permission/
        tabs/
        user/
      styles/
      test/
      types/
      utils/
      views/
        auth/
        dashboard/
        demo/
        error/
        workspace/
```

目录原则：

- `views` 只放页面级组件。
- `components` 放跨页面复用组件。
- `modules` 用领域划分能力，沉淀认证、权限、仪表盘、示例页逻辑。
- `router` 负责静态路由、动态路由转换与注册。
- `stores` 仅存放全局共享状态。

## 7. 权限模型

模板采用常见后台管理系统权限模型：

- 用户
- 角色
- 菜单
- 权限码

前端流程：

1. 用户登录获取 `token`
2. 使用 `token` 拉取当前用户信息
3. 拉取 `menuTree + permissionCodes`
4. 将后端菜单树转换为前端路由
5. 动态注册路由
6. 由路由树派生侧边栏、顶部菜单、面包屑等导航结构
7. 页面内按钮显隐统一由权限码控制

建议接口数据结构：

```ts
interface LoginResult {
  accessToken: string;
  refreshToken?: string;
}

interface UserInfo {
  userId: string;
  username: string;
  nickname: string;
  avatar?: string;
  roles: string[];
}

interface MenuItem {
  name: string;
  path: string;
  component?: string;
  redirect?: string;
  meta: {
    title: string;
    icon?: string;
    hidden?: boolean;
    keepAlive?: boolean;
    affix?: boolean;
    order?: number;
  };
  children?: MenuItem[];
}

type PermissionCode = string;
```

## 8. 路由与权限数据流

### 8.1 动态路由映射

后端菜单项中的 `component` 字段由前端统一映射到本地页面组件：

```ts
const viewModules = import.meta.glob('/src/views/**/*.vue');
```

例如：

- 后端返回：`dashboard/index`
- 前端映射到：`/src/views/dashboard/index.vue`

### 8.2 路由守卫

V3 必备守卫能力：

- 未登录访问业务页跳转登录页
- 已登录访问登录页跳转首页
- 首次访问时自动加载用户信息、菜单、权限码
- 动态路由注册完成前拦截并等待
- 无匹配路由进入 `404`
- 页面无访问权限进入 `403`

### 8.3 按钮权限

统一提供两种权限控制方式：

- 指令：`v-permission="'demo:create'"`
- 工具函数：`hasPermission('demo:create')`

禁止在业务页面中零散编写重复权限判断逻辑。

## 9. 请求层设计

请求层不只是 Axios 二次封装，而是模板的统一接入层：

- 创建统一请求实例
- 自动注入 `token`
- 统一处理接口错误提示
- `401` 时清理登录态并回到登录页
- 支持静默报错模式
- 返回值类型化
- 支持 mock 与真实接口切换

建议统一接口返回格式：

```ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

## 10. V3 页面设计

### 10.1 Login

- 标准后台登录页
- 支持品牌区与表单区结构
- 支持 loading 与错误提示

### 10.2 Dashboard

- 展示基础后台首页
- 包含欢迎区、卡片区、快捷入口、权限按钮示例
- 体现模板布局和基础视觉风格

### 10.3 Demo List

- 演示查询表单、表格、分页、状态列、操作列、弹窗表单
- 演示按钮权限控制方式
- 用于作为业务页面开发参考页

### 10.4 Error Pages

- `403`
- `404`

## 11. 样式策略

样式采用 `TailwindCSS + scoped scss` 组合：

- 布局、间距、快速结构优先用 `TailwindCSS`
- 页面或组件内部的复杂结构、状态样式、动画细节使用 `scoped scss`
- 避免整站回退到纯原子类堆砌
- 避免在页面中堆积大量全局样式

## 12. 页面开发规范

- 页面结构统一按“查询区 / 表格区 / 操作区 / 弹窗区”组织
- `api` 类型定义与页面逻辑分离
- 全局状态进入 `Pinia`，页面临时状态留在页面内部
- 权限控制统一走指令和组合式函数
- 布局组件、业务组件、页面组件职责清晰

## 13. AI 相关规划

当前阶段暂不将 AI 能力作为 V3 交付范围。

后续可在 V1 Pro 阶段考虑：

- 页面生成提示词模板
- 接口字段到 CRUD 页面草稿生成规范
- 模块说明自动生成
- 页面开发 checklist 自动化

当前只保留“AI 友好”的结构化设计方向，不做具体实现。

## 14. 实施建议

实施顺序建议如下：

1. 初始化 `front/V3Lite` 前端工程与基础质量工具
2. 搭建基础布局与登录页
3. 搭建请求层、认证状态、路由守卫
4. 接入动态菜单与动态路由
5. 实现权限指令和权限工具函数
6. 完成异常页和演示页
7. 补齐 mock、环境配置、图标与构建细节
8. 输出 `front/V3Lite/README.md` 和使用文档

## 15. 结论

本方案采用单应用结构，以 `V3 Lite` 为第一阶段目标，优先构建真实后台项目最核心的登录、布局、动态菜单、动态路由、权限与请求底座。后续在不推翻结构的前提下，逐步向 `V2 Standard` 和 `V1 Pro` 演进，以兼顾落地效率、团队易用性和长期维护能力。
