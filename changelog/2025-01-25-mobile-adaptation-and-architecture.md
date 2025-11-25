# 移动端适配与跨平台架构升级

**日期**: 2025-01-25  
**类型**: 架构升级 / 功能增强

## 概述

本次更新实现了移动端适配、历史记录管理、放松工具增强，并建立了支持微信小程序等跨平台复用的代码架构。

## 新增功能

### 1. 跨平台核心架构 (`src/core/`)

#### 类型定义 (`core/types/index.ts`)
```typescript
// 核心类型，可跨平台复用
- User / UserPreferences          // 用户信息
- ScaleType / ScaleInfo           // 量表类型
- AssessmentRecord                // 评估记录
- ToolUsageRecord                 // 工具使用记录
- DailyMood                       // 心情记录
- SyncPayload / SyncResult        // 同步数据结构
- Platform / PlatformCapabilities // 平台适配
```

#### 存储服务 (`core/services/storage.ts`)
```typescript
// 抽象存储接口，支持多平台
interface IStorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}

// 已实现：WebStorageAdapter
// 预留接口：WxStorageAdapter, AsyncStorageAdapter
```

### 2. 状态管理 (`src/stores/useAppStore.ts`)

使用 **Zustand** 实现轻量级全局状态管理：

- **评估记录管理** - 自动保存、排序、限制数量
- **心情记录** - 每日心情追踪
- **用户偏好** - 主题、语言、通知设置
- **统计方法** - 按量表筛选、趋势分析

### 3. 移动端适配

#### 底部导航栏 (`MobileNav.tsx`)
- 四个主要入口：首页、工具箱、记录、我的
- 平滑切换动画
- iOS safe-area 适配

#### 响应式样式优化 (`index.css`)
- 动态视口高度 (`100dvh`)
- iOS safe-area insets
- 触摸目标优化 (44px)
- 滚动条隐藏
- 触觉反馈样式

### 4. 历史记录中心 (`HistoryCenter.tsx`)

- **量表筛选** - 按PHQ-9/GAD-7等筛选
- **统计卡片** - 平均分、最高/低分、趋势分析
- **得分图表** - 可视化得分变化
- **记录管理** - 删除确认、详情展示

### 5. 个人中心 (`ProfileCenter.tsx`)

- **用户卡片** - 评估次数、连续天数
- **同步状态** - 云端同步提示
- **偏好设置** - 主题切换、通知开关
- **数据管理** - 导出/导入/清除数据

### 6. 放松工具增强 (`RelaxTools.tsx`)

#### 呼吸练习增强
- 4种呼吸模式：4-7-8放松、方块呼吸、腹式呼吸、能量呼吸
- 可视化呼吸动画
- 周期计数器

#### 白噪音播放器
- 6种环境音：雨声、海浪、森林、鸟鸣、咖啡馆、微风
- 多声音混合
- 音量独立控制
- 定时关闭功能

#### 渐进式肌肉放松
- 8个肌肉群引导
- 紧绷-放松-休息三阶段
- 进度指示器

### 7. 应用布局重构 (`AppShell.tsx`)

- 整合底部导航与页面切换
- 根据当前状态显示/隐藏导航
- 统一页面过渡动画

## 文件结构变化

```
src/
├── core/                      # 新增：核心业务逻辑层
│   ├── types/
│   │   └── index.ts           # 跨平台类型定义
│   └── services/
│       └── storage.ts         # 存储服务抽象
├── stores/                    # 新增：状态管理
│   └── useAppStore.ts         # Zustand store
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # 新增：应用主布局
│   │   └── MobileNav.tsx      # 新增：移动端导航
│   ├── features/
│   │   └── RelaxTools.tsx     # 新增：放松工具集合
│   └── views/
│       ├── HistoryCenter.tsx  # 新增：历史记录中心
│       └── ProfileCenter.tsx  # 新增：个人中心
└── index.css                  # 更新：移动端样式
```

## 依赖更新

```json
{
  "dependencies": {
    "zustand": "^4.x"  // 新增：状态管理
  }
}
```

## 跨平台复用设计

### 可直接复用的代码
| 模块 | 路径 | 复用性 |
|------|------|--------|
| 类型定义 | `core/types/` | 100% |
| 业务逻辑 | `utils/scoring.ts`, `utils/cbt.ts` | 100% |
| 疗法数据 | `data/therapies/` | 100% |
| 存储接口 | `core/services/storage.ts` | 需适配 |
| 状态管理 | `stores/useAppStore.ts` | 90% |

### 微信小程序适配要点
1. 创建 `WxStorageAdapter` 实现 `IStorageAdapter`
2. 将 React 组件转换为小程序组件
3. 使用 Taro/uni-app 等跨端框架可减少工作量
4. 复用疗法数据和评分逻辑

### 数据同步预留
```typescript
// SyncPayload 结构已定义，支持：
- 评估记录同步
- 工具使用记录同步
- 心情数据同步
- 偏好设置同步
- 冲突解决机制
```

## UI/UX 改进

- 移动端触摸目标优化 (44px)
- 页面切换动画流畅
- 触觉反馈视觉效果
- Safe-area 适配（iPhone X+）
- 滚动条优化

## 后续规划

- [ ] 实现云端同步后端 API
- [ ] 微信小程序适配
- [ ] 添加更多量表（PSS-10、PSQI等）
- [ ] 练习提醒推送
- [ ] 数据可视化报告
- [ ] 社区功能探索
