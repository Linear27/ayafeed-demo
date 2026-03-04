# 05 - 视觉资产规范 (Visual Assets)

## 1. 品牌 Logo (`logo_full.svg`)
- **设计含义**: 采用 `The Messenger / 急速羽翼`，由三段羽翼构成抽象 A 字，强调“速度、传播、权威”。
- **使用场景**: 网站 Header、Footer、个人中心以及纸质印刷物料。
- **色彩规范**:
  - 天狗红: `#DC2626`
  - 墨色: `#111827`
  - 纸白: `#FDFBF7`

## 2. Favicon (`favicon.svg`)
- **设计逻辑**: 采用 `The Messenger` 的高识别简化版。
- **优化点**:
  - 使用 `#111827` 圆角矩形底座，提升浏览器标签页对比度稳定性。
  - 双白 + 单红三段羽翼，保证 16px 级别仍能识别主形态。
  - 移除复杂内部结构，避免小尺寸糊成块。

## 3. 导出建议
- **Web**: 推荐使用内联 SVG 或 DataURI，以减少 HTTP 请求。
- **App**: 若需适配移动端，建议从 `favicon.svg` 导出 180x180 的 PNG 作为 `apple-touch-icon`。
