# 01 - 设计策略 (Design Strategy)

## 1. 核心视觉哲学：报纸主题叙事 (Newspaper Identity)
AyaFeed 的设计灵魂在于 **单主题（Newspaper）**，持续强化“文文。新闻”式的信息密度与沉浸感。

- **报纸模式 (Newspaper Mode)**:
  - **角色定位**: 沉浸式角色扮演。模拟《文文。新闻》的实物感。
  - **设计目标**: 强化“独家”、“速度”与“幻想乡”的氛围。
  - **核心元素**: 4px 粗边框、衬线字体 (Shippori Mincho)、红色印章式标签、米色纸张纹理背景。

## 2. 合同展处理逻辑 (Umbrella Events)
针对京都合同同人祭 (Joint Events) 等复杂展会，采用**伞下架构 (Umbrella Architecture)**：
- **Slot 聚合**: 在列表页，系统将时空一致的子展聚合为一个槽位（Slot），避免冗余。
- **渐进披露**: 详情页通过子展卡片阵列 (Constituent Cards) 快速定位。
- **摊位索引**: 自动提取“文”、“秘”、“求”等 Block 前缀，为社团检索提供索引。

## 3. 响应式布局
- **Desktop**: 采用高度感知的瀑布流。
- **Mobile**: 采用单列线性流，折叠非核心信息（如详细 schedule）。
