# 00 - Agent 协作与系统规范指南 (Agent Guide)

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

### [2025-06-09] - 数据架构原子化重构 (Phase 2 - Completed)
- **执行内容**:
  - 彻底拆分 `EVENTS` 和 `LIVES` 数组，将核心条目（如神居祭、宝藏展、歌祭）独立为 `.ts` 文件。
  - 创建了 `data/events/archive.ts` 用于存放过往活动。
  - 将社团数据分为 `handcrafted.ts` 和 `generator.ts`。
- **状态**: 完成。系统现在具有极高的可维护性。
