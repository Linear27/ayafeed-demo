# 00 - Agent 协作与系统规范指南 (Agent Guide)

## 0. 项目定位与上游参考 (Project Positioning)
- 本仓库用于 `ayafeed-core/apps/web` 的重置规划与方案验证（reset planning sandbox）。
- 上游主仓库：`https://github.com/Linear27/ayafeed-core`
- 本地参考路径：`E:\Code\test1\ayafeed-core\`
- Web 参考目录：`E:\Code\test1\ayafeed-core\apps\web\`

## 1. 核心任务目标
AyaFeed 是一个高度数据驱动的同人展会信息站。Agent 的首要任务是确保 **“展会信息的高度聚合”** 与 **“视觉模态的沉浸感”**。

## 2. Agent 强制工作流 (Workflow)
1.  **启动阶段**：读取 `/docs` 下的所有文档，特别是本指南与 `02_EVENT_TAXONOMY.md`。
2.  **执行阶段**：
    - **回复语言**: 回复用户时必须使用中文。
    - 任何 UI 修改 must be 同时兼容 `theme-newspaper` 和 `theme-saas`。
    - **数据维护规范**: 严禁修改 `data.ts` 根文件来添加条目。必须在 `data/{category}/` 下创建独立的条目文件（如 `sapporo_kamui.ts`），并在对应目录的 `index.ts` 中注册。
    - 保持 `Aya Shameimaru` (射命丸文) 的 AI 人格一致性。
3.  **收尾阶段**：在本页面的 `5. 交接记录 (Handover)`底部追加本次修改的核心逻辑与后续建议。

## 3. 核心业务逻辑摘要 (Must-Know)
- **数据原子化 (Atomic Data)**：
  - 路径: `data/{category}/{entry_id}.ts`。
  - 导出: 每个文件导出一个命名的常量。
  - 聚合: `data/{category}/index.ts` 负责收集所有条目并导出 `EVENTS`, `LIVES`, `CIRCLES` 数组。
- **双模态 (Dual-Mode)**：
  - `Newspaper`: 粗边框 (4px/2px)、米色背景 (`#FDFBF7`)、衬线体。
  - `SaaS`: 圆角、阴影、蓝色调、无衬线体。

## 4. 交接记录 (Handover & Logs)

### [2026-02-25] - UX 优化与关键 Bug 修复 (UX Refinement & Critical Fixes)
- **执行内容**:
  - **P0 崩溃修复**: 解决了 `LiveListView` 和 `CircleListView` 在数据缺失时的崩溃问题，增加了严谨的空值检查。
  - **区域 ID 统一**: 统一了 `AppContext` 与各视图间的区域定义，解决了搜索结果为空的问题。
  - **空状态 (Empty States)**: 为搜索、详情页标签（Access/Ticket/Goods）增加了友好的空状态提示。
  - **Logo 动效**: 为所有 Logo 候选方案增加了基于 `framer-motion` 的 hover 动效。
  - **性能优化**: 修复了全站 `<img>` 标签中 `src=""` 导致的无效网络请求问题。
  - **错误处理**: 实现了全局错误边界 (`routes/__root.tsx`)。
- **状态**: 已完成并验证。

### [2026-03-02] - Navbar 对齐 NYT 滚动样式 (NYT-Inspired Header Behavior)
- **执行内容**:
  - 将报纸模式 header 调整为“双态”：
    - 顶部完整 masthead（文档流中自然滚出）
    - 紧凑 fixed dock（滚动触发显示/隐藏）
  - 滚动判定改为基于 masthead 位置并加入迟滞阈值：
    - 显示：`mastheadBottom <= -24`
    - 隐藏：`mastheadBottom >= 72`
  - 动画策略改为 NYT 风格位移过渡：
    - `transform: translate3d(...)` + `transition-all`
    - 配合 `visibility` / `pointer-events` 消除卡顿与状态错位
  - 信息架构调整：
    - 移除 Landing 顶部 `Vol/Edition/GST/Wind` 条
    - 区域切换入口收敛到 navbar 右上角
    - 区域下拉菜单保持不透明白底
- **参考与映射**:
  - 外部交互参考：`https://www.nytimes.com/`
  - 上游参考区域：`ayafeed-core/apps/web/src/components/Navbar.tsx`、`ayafeed-core/apps/web/src/views/LandingView.tsx`
  - 详细决策文档：`docs/plans/2026-03-02-nyt-navbar-scroll-behavior.md`
- **状态**: 已完成并通过 `npm run lint`、`npm run build`。

### [2026-03-02] - Masthead 常驻导航与列表切换防闪烁 (Masthead Navigation + List Flicker Fix)
- **执行内容**:
  - 在 `theme-newspaper` 的完整 masthead 增加常驻导航条（桌面：展会/演出/社团/组件展示；移动：展会/演出/社团），使未折叠状态下也可跨页跳转。
  - 保持滚动后 `fixed dock` 结构不变，形成 NYT 风格的“完整头部 + 紧凑 dock”双通路导航。
  - 为 `events/lives` 列表引入内存缓存（按 query key），并在视图初始化时优先读取缓存，仅首访显示 skeleton，减少 Navbar 跨列表切换时的闪烁。
  - 在有缓存时采用静默刷新（`forceRefresh`）更新数据，不阻塞首屏渲染。
- **参考与映射**:
  - 外部交互参考：`https://www.nytimes.com/`
  - 本仓库改动文件：`components/Navbar.tsx`、`services/api.ts`、`views/EventListView.tsx`、`views/LiveListView.tsx`
  - 上游参考区域：`ayafeed-core/apps/web/src/components/Navbar.tsx`
- **状态**: 已完成并通过 `npm run lint`、`npm run build`。

### [2026-03-02] - Navbar C 方案：Utility 并入栏目导航行 (Utility Merged Into Section Nav Row)
- **执行内容**:
  - 采纳 C 方案：移除 masthead 顶部独立 utility 条，将其并入 logo 下方栏目导航同一行。
  - 新行布局为“三段式”：
    - 左侧（`xl` 可见）：日期 + `Today's Intelligence`
    - 中间：栏目导航（展会/演出/社团/组件展示）
    - 右侧：区域与语言切换（`md` 下保留紧凑文案，`lg` 显示完整文案）
  - 保持 NYT 双态滚动行为不变（masthead 自然滚出 + compact dock 固定切换）。
- **参考与映射**:
  - 外部交互参考：`https://www.nytimes.com/`
  - 本仓库改动文件：`components/Navbar.tsx`
  - 上游参考区域：`ayafeed-core/apps/web/src/components/Navbar.tsx`
- **状态**: 已完成并通过 `npm run lint`、`npm run build`。

### [2026-03-03] - 导航收敛与地区入口去重 (Navigation Simplification + Region Control Dedup)
- **执行内容**:
  - 将 `组件展示` 从 Navbar 主导航移除（完整 masthead 栏目行、compact dock、移动菜单），主导航收敛为展会/演出/社团。
  - 将 `组件展示` 入口保留在 Footer 的“信息中心”中，作为次级入口。
  - 移除 `EventListView` 与 `LiveListView` 顶部地区切换按钮，避免与 Navbar 全局地区选择重复。
  - 在 `EventListView` 与 `LiveListView` 标题区新增只读“当前地区”提示，保留筛选上下文可见性。
  - 详情空状态提示文案更新为“地区可在顶部导航切换”。
- **参考与映射**:
  - 本仓库改动文件：`components/Navbar.tsx`、`components/Footer.tsx`、`views/EventListView.tsx`、`views/LiveListView.tsx`、`routes/events/index.tsx`、`routes/lives/index.tsx`
  - 上游参考区域：`ayafeed-core/apps/web/src/components/Navbar.tsx`、`ayafeed-core/apps/web/src/views/EventListView.tsx`、`ayafeed-core/apps/web/src/views/LiveListView.tsx`
- **状态**: 已完成并通过 `npm run lint`、`npm run build`。

## 5. 后续建议 (Recommendations)
- **图片资源**: 建议引入 CDN 或统一的占位图服务，以解决部分跨域图片加载不稳定的问题。
- **国际化**: 进一步完善多语言支持，确保所有硬编码文本均可通过翻译配置。
- **性能**: 随着数据量增加，建议对 `CircleListView` 引入虚拟列表 (Virtual List) 优化。
