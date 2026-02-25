# 04 - 技术规格说明 (Technical Specs)

## 1. 瀑布流布局算法
为保证“报纸模式”下视觉的紧凑性，采用**启发式高度估算 (Heuristic Height Estimation)**：
- **基础高度**: 150px
- **图片加成**: 
  - 横向 (Landscape): +180px
  - 纵向 (Portrait): +250px
- **内容加成**: 描述字符数 / 2
- **聚合加成**: 每一个 `Sub Event` 增加 65px 高度。
- **填充逻辑**: 每次插入时计算 Left/Right Column 的当前总估算高度，将新卡片放入较短的一列。

## 2. 摊位号 (SpaceCode) 解析
针对合同展的摊位过滤，采用前缀提取逻辑：
- `Regex: /^([^\u0000-\u007F]|[A-Z])(?=-|\s|\d)/`
- 该正则表达式提取 SpaceCode 开头的非 ASCII 字符（汉字）或大写英文字母。
- **用途**: 在 `EventDetailView` 的 Circles 标签页中生成自动过滤按钮。

## 3. 地图渲染
- **引擎**: MapLibre GL
- **瓦片源**: OpenFreeMap
- **样式**: 自定义 Liberty 风格，报纸模式下调整为高对比度色调。