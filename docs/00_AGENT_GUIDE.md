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

## 5. 后续建议 (Recommendations)
- **图片资源**: 建议引入 CDN 或统一的占位图服务，以解决部分跨域图片加载不稳定的问题。
- **国际化**: 进一步完善多语言支持，确保所有硬编码文本均可通过翻译配置。
- **性能**: 随着数据量增加，建议对 `CircleListView` 引入虚拟列表 (Virtual List) 优化。
