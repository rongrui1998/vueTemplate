# V3 Lite Admin

基于 `Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus + TailwindCSS` 的后台管理模板。

当前版本聚焦 `V3 Lite` 主线能力：

- 登录页与后台基础布局
- 动态菜单、动态路由、路由守卫
- 按钮级权限指令与权限组合式 API
- 本地 mock 登录链路与演示列表页
- ESLint、Stylelint、Prettier、Vitest 基础质量工具

## 目录位置

当前项目实际位于：

```text
front/V3Lite
```

## 快速开始

推荐使用 `pnpm`。

```bash
cd front/V3Lite
pnpm install
pnpm dev
```

本地开发默认地址由 Vite 提供，通常是：

```text
http://localhost:5173
```

演示账号：

- 用户名：`admin`
- 密码：`admin123`

## 常用命令

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm stylelint
pnpm format
pnpm test
pnpm test:watch
```

## 环境变量

项目当前包含以下环境文件：

- `.env.development`
- `.env.test`
- `.env.production`

已定义变量如下：

| 变量名              | 说明                                                     | 当前默认值            |
| ------------------- | -------------------------------------------------------- | --------------------- |
| `VITE_API_BASE_URL` | 请求基础路径                                             | `/api` 或 `/api-test` |
| `VITE_APP_TITLE`    | 应用标题                                                 | `V3 Lite Admin`       |
| `VITE_APP_SUBTITLE` | 侧边栏副标题                                             | `Vue Admin Template`  |
| `VITE_APP_USE_MOCK` | 数据源切换开关，`true` 使用本地 mock，`false` 走请求模式 | `true`                |

注意：

- `src/api/auth/index.ts` 与 `src/api/demo/index.ts` 会根据 `VITE_APP_USE_MOCK` 在本地 mock 与请求模式之间切换。
- 当 `VITE_APP_USE_MOCK=false` 时，请求模式默认依赖以下保留接口：
  - `POST /auth/login`
  - `GET /auth/user-info`
  - `GET /auth/access-context`
  - `GET /demo/records`
- `src/utils/request.ts` 已封装 Axios 实例、`Authorization` 自动注入、统一错误提示，以及 `401` 失效登出和跳转登录页逻辑。

## 登录与权限链路

当前实现的链路如下：

1. 用户在登录页输入账号密码。
2. `userStore.login()` 调用 `src/api/auth/index.ts`，校验演示账号并写入 access token。
3. 登录成功后，`permissionStore.initializeAccess()` 拉取当前用户的 `menuTree + accessCodes`。
4. `transformMenusToRoutes()` 将后端菜单结构映射为本地页面路由。
5. 动态路由挂载到 `Root` 路由下，侧边栏和标签页随菜单数据一起初始化。
6. 全局路由守卫负责未登录跳转登录页、已登录回首页、首次进入时加载权限、无权限跳转 `403`。

相关代码位置：

- `src/app/router/setup-router.ts`
- `src/stores/user/index.ts`
- `src/stores/permission/index.ts`
- `src/router/transform/menu-to-routes.ts`

## 权限控制

当前提供两种权限使用方式。

指令方式：

```vue
<ElButton v-permission="'demo:create'">新增</ElButton>
```

组合式方式：

```ts
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()
```

实现位置：

- `src/directives/permission.ts`
- `src/composables/use-permission.ts`

## 菜单与路由映射规则

后端菜单结构中的 `component` 字段会映射到 `src/views` 下的页面组件：

```ts
const viewModules = import.meta.glob('/src/views/**/*.vue')
```

例如：

- `dashboard/index` -> `src/views/dashboard/index.vue`
- `demo/list` -> `src/views/demo/list.vue`
- `workspace/index` -> `src/views/workspace/index.vue`

如果菜单项：

- 有 `children` 但没有 `component`，会使用 `RouteView` 作为中间路由容器
- 指向了不存在的页面文件，会回退到 `src/views/error/route-missing.vue`

新增后端菜单时，请保证：

- `name` 全局唯一
- `path` 与实际路由一致
- `component` 与 `src/views` 相对路径保持一致，不带 `.vue`
- 页面标题写在 `meta.title`
- 页面权限码写在 `meta.permissionCode`

## 如何新增一个页面

### 1. 创建页面组件

例如新增“客户列表”页面：

```text
src/views/customer/list.vue
```

### 2. 在后端菜单或本地 mock 菜单中添加节点

当前演示项目使用本地 mock，可先修改：

```text
mock/menu.ts
```

示例：

```ts
{
  component: 'customer/list',
  meta: {
    icon: 'User',
    permissionCode: 'customer:list',
    title: '客户列表',
  },
  name: 'CustomerList',
  path: '/customer/list',
}
```

### 3. 补充权限码

同样在 `mock/menu.ts` 的 `demoAccessCodes` 中加入对应权限，例如：

```ts
'customer:list'
```

### 4. 在页面中接入权限控制

如果页面里有新增、删除、导出等按钮，可以使用：

- `v-permission`
- `usePermission()`

### 5. 视情况补测试

建议至少补一类测试：

- 路由转换测试
- 页面渲染测试
- 权限显示测试

## 存储约定

- access token：`localStorage`
  - key: `v3lite-access-token`
- 已访问标签页：`sessionStorage`
  - key: `v3lite-visited-tabs`

相关实现位于 `src/utils/storage.ts`。

## 当前状态说明

当前版本已经可以完成本地 mock 与请求模式两条链路切换，但仍有几项属于“下一阶段可继续增强”的内容：

- 真实接口目前仍是保留路径，后续接入后端时需要和实际接口契约对齐
- `README` 当前以 `V3 Lite` 实际落地能力为准，后续如果进入 `V2 Standard`，标签页、面包屑、缓存策略等说明需要继续扩写

## 质量校验

提交前建议至少执行：

```bash
cd front/V3Lite
pnpm lint
pnpm stylelint
pnpm test
pnpm build
```
