# AyaFeed - Design Strategy & Technical Specification

## 1. Visual Philosophy: The Duality
AyaFeed is built on a toggleable UI system that caters to two distinct user psychological states:
- **Newspaper Mode (Bunbunmaru)**: A high-contrast, "messy-but-organized" layout that evokes the feeling of 19th-century journalism. It prioritizes "flavor" and the "Scoop" identity.
- **SaaS Mode (Clean)**: A modern, low-friction interface designed for data-heavy browsing and utility.

## 2. Component Strategies

### Event List: Heuristic Waterfall
To avoid large visual gaps while maintaining an organic layout:
- **Algorithm**: `Height-Aware Distribution`.
- **Logic**: Each slot's height is estimated based on:
    - Base padding (150px)
    - Image presence/orientation (+180px or +250px)
    - Description word count (tokens/2)
    - Sub-event count (+65px per item)
- **Result**: The "Gap-Minimize" strategy ensures the columns stay within a ~200px delta of each other.

### Event Detail: Progressive Disclosure
Event information is categorized into four specialized views:
1. **Overview**: Executive summary and "Umbrella" sub-event cards.
2. **Circles**: A dedicated sub-engine for booth searching with indexed block filtering.
3. **Bulletins**: A news archive for changes (rescheduling, cancellations).
4. **Access**: Spatial context provided via MapLibre GL and floor-plan image modals.

### Live Stage: High-Contrast Immersion
Live music events use a darker, image-first palette:
- **Artist Cards**: Specialized layouts for `Character + CV` pairs (Circular avatar overlays).
- **Ticketing**: Direct conversion paths using Status Badges (Lottery, Available, Sold Out).

## 3. Intelligence Layer
**Gemini Integration (Aya AI)**:
- Uses `gemini-3-flash-preview` for real-time natural language querying over the event database.
- Personas are strictly enforced via System Instructions to maintain the "Tengu Reporter" theme.

## 4. Performance & UX
- **Framer Motion**: Used for view transitions to minimize perceived latency.
- **Responsive Breakpoints**: Grid-column flipping at `768px` for all dashboard views.
- **Interactive Maps**: Open-source tiles provided by OpenFreeMap to ensure high availability without high cost.
