# 2025-12-16 合并冲突修复与旧代码清理

- **合并冲突修复**
  - 修复 `git pull` 后的冲突文件：`src/App.tsx`、`src/utils/cbt.ts`。
  - `src/App.tsx`：移除冲突标记，统一使用 `useAssessmentFlow` 管理评估流程，并保留将评估结果写入全局状态（历史记录）逻辑。
- **旧实现删除（不归档）**
  - 删除 `src/utils/cbt.ts`（按“旧的不合适的直接删除”原则）。
  - 删除 `docs/_archive/unused-src/` 下的旧归档内容（不再保留归档副本）。
- **必要依赖恢复**
  - 补回 `src/core/types.ts` 与 `src/stores/useAppStore.ts`，以满足现有组件（导航/主页/记录/个人页等）对类型与 store 的引用。
- **验证**
  - 通过 `npm run check`（typecheck/lint/test）。
