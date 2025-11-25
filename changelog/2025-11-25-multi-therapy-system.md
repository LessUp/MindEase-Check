# 多疗法心理治疗系统扩展

**日期**: 2025-11-25  
**类型**: 功能增强

## 概述

基于最新的循证心理学研究，全面扩展心理治疗功能，增加多种主流心理疗法的知识库和交互式练习工具。

## 参考来源

- **Columbia University Psychiatry**: Five Different Approaches to Therapy
- **MDPI Medicina 2024**: Next-Generation CBT for Depression
- **PositivePsychology.com**: ACT Hexaflex Model and Principles
- **DialecticalBehaviorTherapy.com**: DBT Core Skills
- **NCBI**: Gestalt Therapy and IPT Research

## 新增疗法知识库

### 文件结构
```
src/data/therapies/
├── index.ts          # 导出和辅助函数
├── types.ts          # 类型定义
├── cbt.ts            # 认知行为疗法
├── dbt.ts            # 辩证行为疗法
├── act.ts            # 接纳承诺疗法
├── ipt.ts            # 人际关系疗法
├── gestalt.ts        # 格式塔疗法
├── mindfulness.ts    # 正念练习
└── distortions.ts    # 认知扭曲类型
```

### 各疗法核心内容

#### CBT - 认知行为疗法
- 认知重构
- 行为激活
- 思维记录
- 暴露练习

#### DBT - 辩证行为疗法
- TIPP技巧（紧急情绪调节）
- 全然接纳
- 相反行动
- DEAR MAN沟通
- 智慧心

#### ACT - 接纳承诺疗法
- 认知解离
- 价值澄清
- 抛锚技术（ACE）
- 扩展练习
- 承诺行动

#### IPT - 人际关系疗法
- 人际关系清单
- 沟通分析
- 角色扮演
- 哀伤工作
- 角色转变

#### Gestalt - 格式塔疗法
- 空椅技术
- 身体觉察
- 此时此地
- 放大技术
- "我"陈述

#### Mindfulness - 正念练习
- 呼吸觉察
- 身体扫描
- 慈悲冥想
- 5-4-3-2-1感官练习
- 正念行走

## 新增交互式工具组件

### DbtTools.tsx
- **TIPP技巧**：带计时器的紧急情绪调节练习
- **智慧心练习**：引导用户融合情绪心与理性心
- **全然接纳**：分步骤引导接纳无法改变的现实

### ActTools.tsx
- **认知解离**：多种技术帮助与想法保持距离
- **抛锚技术（ACE）**：三步骤稳定情绪风暴
- **价值澄清**：探索生活各领域的核心价值

### MeditationTools.tsx
- **引导式冥想**：身体扫描、慈悲冥想、呼吸觉察（带计时和引导语）
- **5-4-3-2-1感官练习**：交互式感官觉察练习

### TherapyToolbox.tsx
- 整合所有疗法的统一入口
- 根据评估结果智能推荐适合的疗法
- 各疗法详细信息模态窗口

## 更新的功能

### 治疗建议生成系统 (cbt.ts)
- 整合多种疗法技术
- 根据抑郁/焦虑程度动态调整建议
- 每条建议标注来源疗法

### Result.tsx
- 使用新的 `TherapyToolbox` 替换原 `CbtTools`
- 根据评估结果自动推荐适合的疗法
- 增强的视觉层次和用户体验

## 技术细节

### 类型定义
```typescript
type TherapyType = 'CBT' | 'DBT' | 'ACT' | 'IPT' | 'Gestalt' | 'Mindfulness'

interface TherapyInfo {
  id: TherapyType
  name: string
  fullName: string
  description: string
  keyPrinciples: string[]
  bestFor: string[]
  techniques: TherapyTechnique[]
  color: string
  icon: string
}

interface TherapyTechnique {
  id: string
  name: string
  description: string
  steps: string[]
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}
```

### 智能推荐逻辑
```typescript
getRecommendedTherapies(phqLevel, gadLevel): TherapyType[]
```
- 焦虑为主：推荐 ACT, DBT
- 抑郁为主：推荐 IPT, ACT
- 情绪失调明显：推荐 DBT
- 基础推荐：CBT, Mindfulness

## 用户体验改进

1. **渐进式学习**：从简单到复杂的练习分级
2. **即时反馈**：计时器、进度条、完成状态
3. **个性化推荐**：基于评估结果推荐疗法
4. **知识普及**：每种疗法都有详细说明和原理介绍

## 后续优化方向

- [ ] 添加练习记录和进度追踪
- [ ] 增加更多引导式冥想音频
- [ ] 实现练习日记功能
- [ ] 添加社区支持功能
- [ ] 多语言支持
