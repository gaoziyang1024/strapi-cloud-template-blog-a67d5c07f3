# GDITE Strapi Blog API 接口文档

## 项目简介

这是一个基于 Strapi 5.11.0 构建的博客 API 系统，支持多语言（i18n）和内容管理功能。

## 基础信息

- **API 基础地址**: `http://localhost:1337/api`
- **Strapi 版本**: 5.11.0
- **认证方式**: Bearer Token
- **内容类型**: `application/json`

## 认证说明

大部分 API 需要认证才能访问。请在请求头中包含认证信息：

```
Authorization: Bearer YOUR_JWT_TOKEN
```

获取 JWT Token 请使用用户登录接口：
```
POST /auth/local
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "password"
}
```

## API 接口列表

### 1. 文章管理 (Articles)

#### 获取所有文章
- **GET** `/articles`
- **查询参数**:
  - `populate`: 填充关联数据 (author, category, cover)
  - `pagination[page]`: 页码
  - `pagination[pageSize]`: 每页数量
  - `filters`: 过滤条件
  - `sort`: 排序

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "文章标题",
        "description": "文章描述",
        "slug": "article-slug",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "cover": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/image.jpg"
            }
          }
        },
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "作者姓名"
            }
          }
        },
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "分类名称"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

#### 获取单个文章
- **GET** `/articles/{id}`
- **路径参数**: `id` - 文章ID

#### 创建文章
- **POST** `/articles`
- **请求体**:
```json
{
  "data": {
    "title": "文章标题",
    "description": "文章描述",
    "slug": "article-slug",
    "cover": 1,
    "author": 1,
    "category": 1,
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "文章内容"
      }
    ]
  }
}
```

#### 更新文章
- **PUT** `/articles/{id}`

#### 删除文章
- **DELETE** `/articles/{id}`

### 2. 作者管理 (Authors)

#### 获取所有作者
- **GET** `/authors`

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "作者姓名",
        "email": "author@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "avatar": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/avatar.jpg"
            }
          }
        }
      }
    }
  ]
}
```

#### 创建作者
- **POST** `/authors`
- **请求体**:
```json
{
  "data": {
    "name": "作者姓名",
    "email": "author@example.com",
    "avatar": 1
  }
}
```

### 3. 分类管理 (Categories)

#### 获取所有分类
- **GET** `/categories`

#### 创建分类
- **POST** `/categories`
- **请求体**:
```json
{
  "data": {
    "name": "分类名称",
    "slug": "category-slug",
    "description": "分类描述"
  }
}
```

### 4. 事件管理 (Events)

#### 获取所有事件
- **GET** `/events`
- **支持多语言**: 添加 `locale` 参数

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "事件标题",
        "date": "2024-01-01",
        "content": "事件内容",
        "source": "事件来源",
        "descript": "事件描述",
        "artcileId": "unique-id",
        "type": "Summit 2024",
        "locale": "en",
        "attach": {
          "data": []
        }
      }
    }
  ]
}
```

#### 创建事件
- **POST** `/events`
- **请求体**:
```json
{
  "data": {
    "title": "事件标题",
    "date": "2024-01-01",
    "content": "事件内容",
    "source": "事件来源",
    "descript": "事件描述",
    "type": "Summit 2024",
    "locale": "en"
  }
}
```

**事件类型枚举**:
- `Summit 2024`
- `Awards & Competitions`
- `Past Events`

### 5. 新闻室管理 (Newsroom)

#### 获取所有新闻
- **GET** `/newsrooms`
- **支持多语言**: 添加 `locale` 参数

#### 创建新闻
- **POST** `/newsrooms`
- **新闻类型枚举**:
  - `Press Releases`
  - `Industry News`
  - `Newsletter`

### 6. 资源管理 (Resources)

#### 获取所有资源
- **GET** `/resources`
- **支持多语言**: 添加 `locale` 参数

#### 创建资源
- **POST** `/resources`
- **资源类型枚举**:
  - `White Papers`
  - `Technical Reports`
  - `Case Studies`

### 7. 行业管理 (Sectors)

#### 获取所有行业
- **GET** `/sectors`
- **支持多语言**: 添加 `locale` 参数

#### 创建行业
- **POST** `/sectors`
- **行业类型枚举**:
  - `Network`
  - `Datacenter`
  - `Data`
  - `Cloud`
  - `AI`
  - `Security`

### 8. 活动与服务管理 (Activities & Services)

#### 获取所有活动与服务
- **GET** `/activities-and-services`

#### 创建活动与服务
- **POST** `/activities-and-services`
- **类型枚举**:
  - `AI Infrastructure Benchmarks`
  - `International Standards`
  - `Testing & Certification`
  - `Academic Publications`

### 9. 友情链接管理 (Friend Links)

#### 获取所有友情链接
- **GET** `/friend-links`
- **支持多语言**: 添加 `locale` 参数

#### 创建友情链接
- **POST** `/friend-links`
- **请求体**:
```json
{
  "data": {
    "linksName": "链接名称",
    "linksUrl": "https://example.com",
    "locale": "en"
  }
}
```

### 10. 关于我们 (About) - 单例类型

#### 获取关于我们信息
- **GET** `/about`
- **支持多语言**: 添加 `locale` 参数

#### 更新关于我们信息
- **PUT** `/about`
- **请求体**:
```json
{
  "data": {
    "title": "关于我们标题",
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "关于我们内容"
      }
    ],
    "locale": "en"
  }
}
```

### 11. 加入我们 (Join Us) - 单例类型

#### 获取加入我们信息
- **GET** `/joinus`
- **支持多语言**: 添加 `locale` 参数

#### 更新加入我们信息
- **PUT** `/joinus`

### 12. 全局配置 (Global) - 单例类型

#### 获取全局配置
- **GET** `/global`
- **支持多语言**: 添加 `locale` 参数

#### 更新全局配置
- **PUT** `/global`
- **请求体**:
```json
{
  "data": {
    "siteName": "网站名称",
    "siteDescription": "网站描述",
    "favicon": 1,
    "defaultSeo": {
      "metaTitle": "SEO标题",
      "metaDescription": "SEO描述"
    },
    "locale": "en"
  }
}
```

## 文件上传

### 上传文件
- **POST** `/upload`
- **Content-Type**: `multipart/form-data`
- **请求体**: FormData with `files` field

**响应示例**:
```json
[
  {
    "id": 1,
    "name": "image.jpg",
    "url": "/uploads/image.jpg",
    "mime": "image/jpeg",
    "size": 12345
  }
]
```

## 用户认证

### 用户注册
- **POST** `/auth/local/register`
- **请求体**:
```json
{
  "username": "username",
  "email": "user@example.com",
  "password": "password"
}
```

### 用户登录
- **POST** `/auth/local`
- **请求体**:
```json
{
  "identifier": "user@example.com",
  "password": "password"
}
```

### 获取当前用户信息
- **GET** `/users/me`
- **需要认证**

## 通用查询参数

### 分页
```
?pagination[page]=1&pagination[pageSize]=10
```

### 排序
```
?sort[0]=createdAt:desc&sort[1]=title:asc
```

### 过滤
```
?filters[title][$contains]=关键词
?filters[createdAt][$gte]=2024-01-01
```

### 填充关联数据
```
?populate=*
?populate[author][populate]=avatar
?populate[category]=true
```

### 多语言
```
?locale=en
?locale=zh
```

## HTTP 状态码

- `200` - 成功
- `201` - 创建成功
- `400` - 请求错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源不存在
- `500` - 服务器错误

## 错误响应格式

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "字段验证失败",
    "details": {
      "errors": [
        {
          "path": ["title"],
          "message": "标题不能为空"
        }
      ]
    }
  }
}
```

## 注意事项

1. 所有时间戳使用 ISO 8601 格式
2. 支持多语言的接口需要指定 `locale` 参数
3. 单例类型（about, joinus, global）只能更新，不能创建或删除
4. 文件上传后返回的 ID 可用于关联其他内容
5. 使用 `populate` 参数可以获取关联数据，避免多次请求 