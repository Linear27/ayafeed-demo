# 2026-03-02 - NYT Navbar 滚动行为决策记录

## 1. 背景
- 目标：修复 AyaFeed 报纸模式（`theme === newspaper`）下 navbar 在滚动时占位过大、收起/展开卡顿、样式切换不稳定的问题。
- 参考基线：`https://www.nytimes.com/` 的 masthead + compact dock 行为。
- 观测日期：2026-03-02（本地联调 + 站点行为采样）。

## 2. 参考来源与范围
- 外部交互参考：
  - NYT 首页 header 行为（滚动触发固定紧凑条、回顶隐藏、统一缓动）。
- 上游仓库参考区域（用于迁移映射）：
  - `E:\Code\test1\ayafeed-core\apps\web\src\components\Navbar.tsx`
  - `E:\Code\test1\ayafeed-core\apps\web\src\views\LandingView.tsx`
- 本仓库落地点：
  - `components/Navbar.tsx`
  - `views/LandingView.tsx`
  - `routes/__root.tsx`
  - `routes/index.tsx`

## 3. 行为规格（最终）
- 状态 A：顶部完整 masthead
  - 完整 masthead 在文档流中自然滚出。
  - fixed dock 保持挂载，但隐藏到视口外且不可交互。
- 状态 B：紧凑 fixed dock
  - 当 masthead 底部越过阈值后，显示紧凑 dock。
  - dock 固定在顶部，承担主导航与快速入口。
- 回退逻辑（带迟滞，防抖动）：
  - 显示条件：`mastheadBottom <= -24`
  - 隐藏条件：`mastheadBottom >= 72`

## 4. 实现策略
- 滚动判定：
  - 以 masthead 实际位置（`getBoundingClientRect().bottom`）作为状态机输入。
  - 通过 `requestAnimationFrame` 合并滚动计算，避免高频 setState 抖动。
- 动画与可交互性：
  - dock 永远 mounted，不做频繁 mount/unmount。
  - 使用 `transform: translate3d(0, 0, 0) / translate3d(0, -70px, 0)` 做主动画。
  - 同步切换 `visibility` 与 `pointer-events`，防止“看不见但可点/可见但不可点”。
  - 过渡曲线：`cubic-bezier(0.23, 1, 0.32, 1)`；时长 `500ms`。

## 5. 信息架构与视觉决策
- 移除首页原 utility strip：
  - `Vol. 13,042`
  - `中国大陆版 EDITION`
  - `GENSOKYO STANDARD TIME`
  - `Wind: 45m/s`
- 区域切换入口收敛到 navbar 右上角（与语言入口并列）。
- 区域下拉菜单采用不透明白底（`bg-white` + 黑色边框），不使用半透明样式。

## 6. 与 NYT 的“保留 vs. 有意差异”
- 保留（Keep）：
  - fixed compact dock + 位移显示/隐藏模型。
  - 顶部完整 masthead 与紧凑 dock 的双态切换。
  - 迟滞阈值避免临界点闪烁。
- 有意差异（Intentional Changes）：
  - 品牌视觉与文案保留 AyaFeed 世界观，不复制 NYT 内容结构。
  - 阈值根据本项目 masthead 实测高度（约 174px）调参，不硬拷贝 NYT 数值。
  - 区域/语言入口位置按 AyaFeed 信息架构调整到右上角。

## 7. 验证证据
- 构建与规范检查：
  - `npm run lint`：通过
  - `npm run build`：通过（保留既有 chunk size warning，非本次回归问题）
- 手工回归：
  - 下滑：masthead 滚出后出现紧凑 dock。
  - 上拉回顶：dock 隐藏并回到完整 masthead 态。
  - 区域下拉：不透明样式且点击行为正常。

## 8. 后续迁移说明（面向 ayafeed-core）
- 可迁移最小集合：
  - `Navbar` 的双态状态机（基于 masthead position + hysteresis + rAF）。
  - `LandingView` 顶部冗余 utility strip 移除策略。
  - 区域入口并入 navbar 顶部工具区的交互模式。
- 迁移时需要重新标定：
  - 上游实际 masthead 高度对应的 show/hide 阈值。
  - 上游字体与行高差异导致的 dock 高度与位移值。
