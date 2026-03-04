# 00 - Agent 协作与系统规范指南 (Agent Guide)

## 0. 项目定位与上游参考 (Project Positioning)
- 本仓库用于 `ayafeed-core/apps/web` 的重置规划与方案验证（reset planning sandbox）。
- 上游主仓库：`https://github.com/Linear27/ayafeed-core`
- 本地参考路径：`E:\Code\test1\ayafeed-core\`
- Web 参考目录：`E:\Code\test1\ayafeed-core\apps\web\`

## 1. 核心任务目标
AyaFeed 是一个高度数据驱动的同人展会信息站。Agent 的首要任务是确保 **“展会信息的高度聚合”** 与 **“视觉模态的沉浸感”**。

## 2. Agent 长期工作流 (Workflow)
1. **启动阶段**：优先读取 `docs/` 下的协作文档，特别是本指南与领域基线文档。
2. **执行阶段**：
   - **回复语言**：回复用户时使用中文。
   - **单主题约束**：仅支持 `theme-newspaper`。
   - **包管理器约束**：仅使用 `pnpm` 安装依赖与执行脚本。
   - **AI Studio 临时文件规范**：pull/sync 产物统一落盘到 `.tmp/aistudio/`，禁止落盘到仓库根目录；相关任务结束前执行 `pnpm aistudio:clean-temp`。
   - **数据维护规范**：严禁在根 `data.ts` 直接新增条目；必须在 `data/{category}/` 新建原子条目并在对应 `index.ts` 注册。
   - **人格一致性**：保持 `Aya Shameimaru`（射命丸文）的人格语气一致性。
3. **收尾阶段**：
   - 本文件仅维护长期有效规则。
   - 日常改动与临时实现细节不再记录于本文件。

## 3. 核心业务逻辑基线 (Must-Know)
- **数据原子化 (Atomic Data)**：
  - 路径：`data/{category}/{entry_id}.ts`
  - 导出：每个文件导出一个命名常量
  - 聚合：`data/{category}/index.ts` 负责汇总并导出数组（如 `EVENTS` / `LIVES` / `CIRCLES`）
- **单主题视觉系统 (Single Theme / Newspaper)**：
  - 粗边框（4px/2px）
  - 米色背景（`#FDFBF7`）
  - 衬线化报纸风排版语言

## 4. 稳定决策索引 (Stable Decisions)
- `docs/plans/2026-03-02-nyt-navbar-scroll-behavior.md`
- `docs/plans/2026-03-03-landing-ux-stabilization.md`

## 5. 文档策略 (Documentation Policy)
- `docs/00_AGENT_GUIDE.md` 只保留长期有效规则与稳定决策索引。
- 日常改动、过程性日志、临时排障记录不再进入本文件。
- 若出现新的稳定决策：
  1. 先沉淀到 `docs/**` 的专题文档（如 `docs/plans/**`）。
  2. 再在本文件的“稳定决策索引”中增加链接。
