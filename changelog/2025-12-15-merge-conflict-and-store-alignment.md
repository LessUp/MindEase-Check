# 2025-12-15 合并冲突清理与状态/类型对齐

## 变更概述

- 解决多文件合并冲突，优先采用根目录 `src/` 的新架构实现。
- 对齐多疗法工具箱相关数据结构与推荐逻辑。
- 扩展全局状态（Zustand）与核心类型，以匹配首页/历史/个人中心等页面实际用法。

## 主要改动

- **冲突清理**
  - 清理 `src/App.tsx`、`src/components/views/Result.tsx`、`src/components/features/TherapyToolbox.tsx` 的冲突标记并统一实现。
  - `src/App.tsx`：补齐 `triage`/严重程度信息的导入，并使用 `writeLatestSnapshot` 恢复本地快照写入；移除未使用的快照恢复相关代码以避免 lint 报错。
- **疗法数据结构与推荐**
  - 在 `src/data/therapies.ts` 增加 `TherapyType` / `ALL_THERAPIES` 等多疗法结构。
  - 调整 `getRecommendedTherapies` 返回 `TherapyType[]`，用于在 `TherapyToolbox` 中高亮推荐疗法。
- **类型与 Store 对齐**
  - `src/core/types.ts`：扩展 `ScaleType`，补齐 `DailyMood`、`UserPreferences`、并将 `TabType` 扩展包含 `tools`。
  - `src/stores/useAppStore.ts`：新增 `moods`/`preferences`/`deleteAssessment` 等 state/actions，并纳入持久化 `partialize`；同时将 `addMood` 调整为由 store 内部生成 `id/date`，避免组件层直接调用 `Date.now()`。
  - `src/components/views/HomePage.tsx`：为 `QUICK_TOOLS` 添加 `as const`，修复 `getColor` 参数类型不匹配导致的 typecheck 报错；并清理未使用导入。
  - 处理 `npm run lint` 报错：清理未使用变量/导入（`src/App.tsx`、`ActTools`、`DbtTools`、`MeditationTools`、`RelaxTools`、`HistoryCenter`、`ProfileCenter`），并调整 `MeditationTools`/`DbtTools` 的计时/阶段计算逻辑以满足 hooks 规则。
 - **旧子项目收尾**
   - 删除 `cbt-diagnostic-app/package.json`、`cbt-diagnostic-app/package-lock.json`。
   - 移除 `cbt-diagnostic-app/src` 中遗留实现（源码已迁移到根目录 `src/`）。

## 备注

- `cbt-diagnostic-app/` 目录当前仅剩本地构建产物 `dist/`（未跟踪），建议删除以保持工作区干净。
