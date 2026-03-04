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
    - 仅支持单主题：`theme-newspaper`。
    - **AI Studio 临时文件规范**: pull/sync 产物必须写入 `.tmp/aistudio/`，禁止落盘到仓库根目录；完成相关任务前运行 `pnpm aistudio:clean-temp` 做搬运与过期清理（默认保留 7 天）。
    - **数据维护规范**: 严禁修改 `data.ts` 根文件来添加条目。必须在 `data/{category}/` 下创建独立的条目文件（如 `sapporo_kamui.ts`），并在对应目录的 `index.ts` 中注册。
    - 保持 `Aya Shameimaru` (射命丸文) 的 AI 人格一致性。
3.  **收尾阶段**：在本页面的 `5. 交接记录 (Handover)`底部追加本次修改的核心逻辑与后续建议。

## 3. 核心业务逻辑摘要 (Must-Know)
- **数据原子化 (Atomic Data)**：
  - 路径: `data/{category}/{entry_id}.ts`。
  - 导出: 每个文件导出一个命名的常量。
  - 聚合: `data/{category}/index.ts` 负责收集所有条目并导出 `EVENTS`, `LIVES`, `CIRCLES` 数组。
- **单主题 (Single Theme / Newspaper)**：
  - 粗边框 (4px/2px)、米色背景 (`#FDFBF7`)、衬线体。

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
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`。

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
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`。

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
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`。

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
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`。

### [2026-03-03] - Landing Page 全量 UX 修复 (Landing UX Stabilization)
- **执行内容**:
  - 落地页交互语义修复：将关键点击区域替换为 `Link`/`button`，去除导航型 `div onClick`。
  - 标题与主内容语义修复：新增页面主标题（`sr-only h1`），Navbar 品牌标题降级为非 `h1`，避免多主标题冲突。
  - 快速跳转修复：`Quick Jump` 改为真实月锚点（`month-YYYY-MM`）并接入时间轴卡片首条锚点。
  - 可访问性增强：新增全局 `skip link`、统一 `focus-visible` 样式、AI 对话消息区 `aria-live`、输入标签补齐。
  - 视觉层级重排：弱化次级卡片和侧栏权重，保留主头条为首屏唯一高权重模块。
  - 动画与性能收敛：替换核心页面 `transition-all` 为显式属性过渡；补齐关键图片 `width/height` 与 `loading/fetchPriority` 策略。
  - 主题与交互细节：补充 `theme-color`，加入 `prefers-reduced-motion` 兜底规则与 `touch-action: manipulation`。
- **参考与映射**:
  - 本仓库改动文件：`components/LandingSections.tsx`、`views/LandingView.tsx`、`components/Navbar.tsx`、`components/Footer.tsx`、`components/AIChat.tsx`、`routes/__root.tsx`、`index.css`、`index.html`
  - 上游参考区域：`ayafeed-core/apps/web/src/views/LandingView.tsx`、`ayafeed-core/apps/web/src/components/LandingSections.tsx`、`ayafeed-core/apps/web/src/components/Navbar.tsx`
  - 保留：报纸主题视觉语言与 Navbar 双态滚动模式
  - 有意变化：语义化交互、月锚点跳转链路、焦点体系统一、首屏视觉权重收敛
  - 详细决策文档：`docs/plans/2026-03-03-landing-ux-stabilization.md`
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`（仅保留 Vite chunk size warning）。

### [2026-03-03] - Landing 重构二阶段落地 (Landing Refactor Phase 2 Implementation)
- **执行内容**:
  - Navbar 交互模型升级为 NYT 风格三态状态机：`top` / `reading-down` / `reading-up`，并新增 `data-aya-state` 调试钩子。
  - compact dock 动画降噪：改为 200ms transform-only 过渡，消除旧版 `duration-500` 的迟滞与卡顿感。
  - Landing 首屏层级收敛：
    - 保留主故事主 CTA
    - 降级侧栏高冲突 CTA 组为低权重文本入口
    - `Next Major Event` 卡片从高饱和红块降级为次级白底信息卡
  - 时间轴卡片可读性优化：取消全量旋转，仅保留极少量装饰性元素，阴影强度收敛。
  - 移动端新增 sticky Quick Jump 条（月份 chips），并修复 `overflow-x-hidden` 导致 sticky 失效的问题。
  - AI 浮窗干扰控制：landing 页面下滑自动弱化、上滑恢复，移动端按钮尺寸降低。
  - 设计 token 基线补齐：`--aya-color-*`、`--aya-motion-*`、`--aya-shadow-*`、`--aya-header-height-compact`。
- **参考与映射**:
  - 本仓库改动文件：`components/Navbar.tsx`、`components/LandingSections.tsx`、`views/LandingView.tsx`、`components/AIChat.tsx`、`index.css`、`docs/plans/2026-03-03-landing-ux-stabilization.md`
  - 外部行为参考：`https://www.nytimes.com/`（仅交互模型参考，不做视觉像素级复刻）
  - 上游参考区域：`ayafeed-core/apps/web/src/components/Navbar.tsx`、`ayafeed-core/apps/web/src/views/LandingView.tsx`、`ayafeed-core/apps/web/src/components/LandingSections.tsx`
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`（仅保留 Vite chunk size warning）。

### [2026-03-03] - 单主题口径统一 (Single-Theme Documentation Alignment)
- **执行内容**:
  - 移除协作文档与设计文档中的过时主题兼容表述，统一为仅支持 `theme-newspaper`。
  - 将 Agent workflow 中的 UI 约束改为单主题约束，避免后续实现误回退到历史兼容路径。
  - 更新对外说明文档（README）为单主题视觉体系描述。
- **参考与映射**:
  - 本仓库改动文件：`AGENTS.md`、`docs/00_AGENT_GUIDE.md`、`docs/01_DESIGN_STRATEGY.md`、`README.md`
  - 保留：报纸主题视觉语言与现有交互策略
  - 有意变化：删除历史兼容描述，统一单主题文案
- **状态**: 已完成（文档口径已统一为单主题）。

### [2026-03-03] - 包管理器口径统一为 PNPM (Package Manager Standardization)
- **执行内容**:
  - 删除 `package-lock.json`，避免与 `pnpm-lock.yaml` 双锁文件并存导致的依赖漂移。
  - 在 `package.json` 增加 `packageManager: pnpm@10.26.1`，固定项目包管理器入口。
  - 在 `AGENTS.md` 增加强约束：仅允许使用 `pnpm` 执行依赖安装与脚本命令。
- **参考与映射**:
  - 本仓库改动文件：`package.json`、`AGENTS.md`、`package-lock.json`
  - 保留：现有 `pnpm-workspace.yaml` + `pnpm-lock.yaml` 工作流
  - 有意变化：移除非 `pnpm` 工作流入口，统一至单一包管理器
- **状态**: 已完成。

### [2026-03-04] - AI Studio 临时文件治理 (AI Studio Temp Artifact Governance)
- **执行内容**:
  - 在 `AGENTS.md` 新增 `AI Studio Temp File Policy`：要求 pull/sync 临时产物统一落盘到 `.tmp/aistudio/`，禁止直接写仓库根目录。
  - 在 `.gitignore` 增加 `aistudio-*` 与 `.tmp-sync-*`/`.tmp-head-*.bin` 相关规则，避免临时产物污染 Git 变更。
  - 新增脚本 `scripts/cleanup-aistudio-temp.mjs` 并在 `package.json` 暴露 `pnpm aistudio:clean-temp`：
    - 自动搬运根目录误落盘临时文件到 `.tmp/aistudio/`
    - 按保留天数清理旧文件（默认 7 天，可通过 `--retention-days=<N>` 覆盖）
- **参考与映射**:
  - 本仓库改动文件：`AGENTS.md`、`.gitignore`、`scripts/cleanup-aistudio-temp.mjs`、`package.json`
  - 上游参考区域：无（仓库级协作与工作区治理策略）
  - 保留：现有 `pnpm` 单包管理器工作流与 docs-first 协作规范
  - 有意变化：新增 AI Studio 临时文件目录约束与可执行清理入口
- **状态**: 已完成（已可通过 `pnpm aistudio:clean-temp` 执行治理）。

### [2026-03-04] - package.json 包名规范修复 (Package Name Schema Fix)
- **执行内容**:
  - 将 `package.json` 中不符合 npm 命名规范的 `name`（含中文与特殊符号）改为合法小写包名 `ayafeed-demo`。
  - 保持其余脚本、依赖与 `pnpm` 相关配置不变，确保为最小改动。
- **参考与映射**:
  - 本仓库改动文件：`package.json`
  - 上游参考区域：无（仓库元数据规范修复）
  - 保留：现有 `pnpm` 工作流与版本约束
  - 有意变化：仅修复包名以满足 JSON schema / npm package name pattern
- **状态**: 已完成（已通过正则匹配验证）。

### [2026-03-04] - 组件展示 Logo 候选卡片动效修正 (Remove Card Hover Motion)
- **执行内容**:
  - 移除 `Logo Candidates` 区域外层卡片的 hover 位移动效，避免“卡片在动”偏离预期。
  - 保留 `whileHover="hover"` 事件透传，用于继续触发 Logo 本体（`motion.path/circle/rect`）与内部文字等子元素动效。
- **参考与映射**:
  - 本仓库改动文件：`components/logo-candidates/AyaLogoCandidates.tsx`
  - 上游参考区域：无（本仓库组件展示页行为修正）
  - 保留：Logo 本体 hover 动效结构
  - 有意变化：移除卡片容器 hover 位移
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`（保留既有 chunk size warning）。

### [2026-03-04] - Logo 候选动效范围收敛 (Only Icon Preview SVG Animates)
- **执行内容**:
  - 将 `Logo Candidates` 卡片内动画进一步收敛为仅 `Icon Preview` 顶部 SVG 在 hover 时触发。
  - 移除其余区域 hover 动画：`Lockup` 文本位移、评分点 hover、推荐区卡片与问答条目 hover。
- **参考与映射**:
  - 本仓库改动文件：`components/logo-candidates/AyaLogoCandidates.tsx`
  - 上游参考区域：无（本仓库展示交互修正）
  - 保留：各 Logo 图形的 `variants.hover` 定义
  - 有意变化：仅在 `Icon Preview` 包裹层保留 `whileHover="hover"`
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`（保留既有 chunk size warning）。

### [2026-03-04] - 候选 SVG 动效扩展 (Animate Candidate SVG Instances)
- **执行内容**:
  - 在 `Logo Candidates` 卡片中为各候选 SVG 实例统一增加 hover 触发（大图、Lockup 图标、24px、16px、B&W）。
  - 保持“仅 SVG 动、卡片不动”的约束不变。
- **参考与映射**:
  - 本仓库改动文件：`components/logo-candidates/AyaLogoCandidates.tsx`
  - 上游参考区域：无（本仓库展示交互调整）
  - 保留：外层卡片无 hover 位移
  - 有意变化：新增 `renderAnimatedIcon` 统一封装 SVG hover 触发
- **状态**: 已完成并通过 `pnpm lint`、`pnpm build`（保留既有 chunk size warning）。

## 5. 后续建议 (Recommendations)
- **图片资源**: 建议引入 CDN 或统一的占位图服务，以解决部分跨域图片加载不稳定的问题。
- **国际化**: 进一步完善多语言支持，确保所有硬编码文本均可通过翻译配置。
- **性能**: 随着数据量增加，建议对 `CircleListView` 引入虚拟列表 (Virtual List) 优化。
