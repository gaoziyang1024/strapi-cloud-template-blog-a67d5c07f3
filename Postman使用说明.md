# GDITE Blog API Postman 使用说明

## 文件说明

本目录包含以下文件：

1. **API_Documentation.md** - 完整的 API 接口文档
2. **GDITE-Blog-API.postman_collection.json** - Postman 集合文件
3. **GDITE-Blog-Environment.postman_environment.json** - Postman 环境配置文件
4. **Postman使用说明.md** - 本使用说明文件

## 导入步骤

### 1. 导入 Postman 集合

1. 打开 Postman 应用
2. 点击左上角的 "Import" 按钮
3. 选择 `GDITE-Blog-API.postman_collection.json` 文件
4. 点击 "Import" 确认导入

### 2. 导入环境配置

1. 在 Postman 中点击右上角的齿轮图标（Manage Environments）
2. 点击 "Import" 按钮
3. 选择 `GDITE-Blog-Environment.postman_environment.json` 文件
4. 点击 "Import" 确认导入
5. 选择 "GDITE Blog Environment" 作为当前环境

## 使用前准备

### 1. 线上服务地址

**线上环境**：API 地址为 `https://top.gditc.org/api`

**本地开发**（如需要）：
```bash
# 在项目根目录运行
npm run develop
```

本地服务启动后，API 将在 `http://localhost:1337/api` 可用。

### 2. 访问管理后台

**线上管理后台**：`https://top.gditc.org/admin`

**本地管理后台**（如使用本地开发）：`http://localhost:1337/admin`

首次访问时需要创建管理员账户。

### 3. 配置API权限

在 Strapi 管理后台中：

1. 进入 "Settings" > "Users & Permissions plugin" > "Roles"
2. 点击 "Public" 角色
3. 为需要公开访问的 API 设置权限（如 find, findOne）
4. 点击 "Save" 保存设置

## 测试流程

### 1. 用户认证（推荐）

1. 首先运行 "认证管理" > "用户注册" 创建测试用户
2. 然后运行 "认证管理" > "用户登录" 获取 JWT Token
3. Token 会自动保存到环境变量中，后续请求自动使用

### 2. 测试各个 API 模块

按以下顺序测试：

1. **基础数据创建**：
   - 作者管理 > 创建作者
   - 分类管理 > 创建分类

2. **内容管理**：
   - 文章管理 > 创建文章
   - 事件管理 > 创建事件
   - 新闻室管理 > 创建新闻

3. **其他模块**：
   - 资源管理
   - 行业管理
   - 活动与服务
   - 友情链接

4. **单例类型**：
   - 关于我们
   - 全局配置

## 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `base_url` | API 基础地址 | `https://top.gditc.org/api` |
| `admin_url` | 管理后台地址 | `https://top.gditc.org/admin` |
| `jwt_token` | JWT 认证令牌 | 自动设置 |
| `user_email` | 测试用户邮箱 | `test@example.com` |
| `user_password` | 测试用户密码 | `password123` |
| `locale_zh` | 中文语言代码 | `zh` |
| `locale_en` | 英文语言代码 | `en` |

## 常见问题

### 1. 认证失败

**问题**：请求返回 401 Unauthorized

**解决方案**：
1. 确保已运行用户登录接口获取 Token
2. 检查 JWT Token 是否正确设置在环境变量中
3. 确认 API 权限配置正确

### 2. 数据创建失败

**问题**：POST 请求返回 400 Bad Request

**解决方案**：
1. 检查请求体格式是否正确
2. 确认必填字段是否都已提供
3. 检查数据类型是否匹配 Schema 定义

### 3. 多语言内容

**问题**：无法获取指定语言的内容

**解决方案**：
1. 确保在查询参数中添加 `locale=zh` 或 `locale=en`
2. 确认内容类型启用了 i18n 插件
3. 检查创建内容时是否指定了正确的 locale

### 4. 关联数据获取

**问题**：响应中缺少关联数据

**解决方案**：
1. 在查询参数中添加 `populate=*` 获取所有关联数据
2. 使用更精确的 populate 参数，如 `populate[author]=true`

## 高级用法

### 1. 批量测试

使用 Postman Runner 功能：
1. 选择集合或文件夹
2. 点击 "Run" 按钮
3. 配置运行参数
4. 开始批量测试

### 2. 自动化测试

在请求的 "Tests" 标签中添加断言：

```javascript
pm.test("状态码应该是 200", function () {
    pm.response.to.have.status(200);
});

pm.test("响应应该包含数据", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.data).to.not.be.undefined;
});
```

### 3. 数据驱动测试

1. 准备 CSV 或 JSON 格式的测试数据
2. 在 Runner 中选择数据文件
3. 在请求中使用 `{{变量名}}` 引用数据

## 技术支持

如遇问题，请参考：

1. [Strapi 官方文档](https://docs.strapi.io/)
2. [Postman 官方文档](https://learning.postman.com/)
3. 项目 API 文档：`API_Documentation.md`

## 更新历史

- v1.0.0 - 初始版本，包含所有基础 API 接口 