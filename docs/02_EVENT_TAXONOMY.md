# 02 - 展会数据分类学 (Event Taxonomy)

## 1. 展会模型定义

### Type A: Standard (标准型)
- **定义**: 独立的同人即卖会。
- **数据结构**: 典型的单个 `Event` 对象。

### Type B: Joint / Umbrella (联合展 / 伞下展)
- **定义**: 多个 Only 展在同一场地、同一时间联合举办。
- **典型案例**: 京都合同同人祭、博丽神社例大祭 (带 Petit 企划时)。
- **核心字段**:
  - `relatedEvents`: `type` 标记为 `'Sub'` 的对象数组。
  - `boothCount`: 填入该 Slot 的总摊位数。
- **UI 触发**: 当 `relatedEvents` 包含 `Sub` 类型时，详情页会自动激活“子展阵列”视图。

### Type C: Petit Only (内嵌型 / 企划型)
- **定义**: 在大规模展会（如 Comiket）内部举办的小型专题。
- **数据结构**: 在主展的 `relatedEvents` 中标记为 `'External'`。

## 2. Slotting 聚合规则
系统判定唯一展会位的逻辑：
- `KEY = date + location`
- 聚合后的卡片会选取 `boothCount` 最大或标题中带有“合同/联合”字样的展会作为 Master 展示。