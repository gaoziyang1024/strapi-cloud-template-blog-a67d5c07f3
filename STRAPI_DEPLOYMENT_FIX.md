# Strapi 部署错误修复指南

## 问题描述
Strapi在部署时遇到数据库迁移错误：
```
alter table "public"."events" alter column "content" type jsonb using ("content"::jsonb) - invalid input syntax for type json
```

## 错误原因
`events`表中的`content`字段包含无效的JSON数据，导致PostgreSQL无法将其转换为JSONB类型。

## 解决方案

### 方案1：快速修复（推荐）
```bash
# 1. 运行快速修复脚本
node quick-fix-database.js

# 2. 重新部署
npm run deploy
```

### 方案2：手动修复
```bash
# 1. 检查数据库状态
npm run pre-deploy-check

# 2. 修复JSON数据
npm run fix-json

# 3. 安全部署
npm run deploy-safe
```

### 方案3：直接SQL修复
```sql
-- 连接到PostgreSQL数据库
-- 执行以下SQL命令

-- 修复events表的content字段
UPDATE events 
SET content = '{"blocks":[{"type":"paragraph","children":[{"type":"text","text":"内容已修复"}]}]}'
WHERE content IS NULL 
   OR content = '' 
   OR content = 'null'
   OR content = 'undefined'
   OR content NOT LIKE '{%'
   OR content NOT LIKE '[%';

-- 验证修复结果
SELECT COUNT(*) FROM events WHERE content IS NOT NULL;
```

## 新增的脚本命令

### package.json 新增命令：
- `npm run fix-json` - 修复JSON数据
- `npm run pre-deploy-check` - 部署前检查
- `npm run deploy-safe` - 安全部署（包含检查和修复）

### 修复脚本文件：
- `quick-fix-database.js` - 快速修复数据库
- `fix-json-data.js` - 详细修复脚本
- `pre-deploy-check.js` - 部署前检查
- `fix-json-migration.sql` - SQL修复脚本

## 预防措施

### 1. 数据验证
在Strapi中创建内容时，确保content字段始终包含有效的JSON结构。

### 2. 部署前检查
每次部署前运行：
```bash
npm run pre-deploy-check
```

### 3. 安全部署
使用安全部署命令：
```bash
npm run deploy-safe
```

## 故障排除

### 如果修复后仍有问题：
1. 检查数据库连接字符串是否正确
2. 确认PostgreSQL版本支持JSONB
3. 检查Strapi版本兼容性

### 如果数据丢失：
1. 从备份恢复数据
2. 重新运行修复脚本
3. 手动检查重要记录

## 联系支持
如果问题仍然存在，请提供：
1. 完整的错误日志
2. 数据库表结构信息
3. 受影响的数据样本
