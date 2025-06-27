# Cloudflare CDN配置指南

## 🌐 Cloudflare部署CDN配置方案

根据您的Cloudflare部署方式，有以下几种CDN配置方案：

## 📋 方案一：直接使用主域名（推荐）

如果您的项目部署在 `https://gditc.org`，Cloudflare会自动提供CDN加速。

### 环境变量配置：
```env
# 使用主域名，Cloudflare自动CDN加速
CDN_URL=https://gditc.org
```

### 优势：
- ✅ 自动CDN加速
- ✅ 无需额外配置
- ✅ SSL自动管理
- ✅ 全球节点分发

## 📋 方案二：使用CDN子域名

创建专用的CDN子域名，如 `cdn.gditc.org`：

### 1. Cloudflare DNS配置：
在Cloudflare DNS中添加CNAME记录：
```
cdn.gditc.org -> gditc.org (橙色云朵启用代理)
```

### 2. 环境变量配置：
```env
# 使用CDN子域名
CDN_URL=https://cdn.gditc.org
```

### 3. Strapi配置：
```javascript
// config/plugins.js
module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 100000000,
                baseURL: env('CDN_URL', 'https://cdn.gditc.org')
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    }
});
```

## 📋 方案三：使用Cloudflare R2存储

如果使用Cloudflare R2作为对象存储：

### 1. 环境变量配置：
```env
# R2存储配置
CDN_URL=https://your-bucket.your-account.r2.cloudflarestorage.com
# 或使用自定义域名
CDN_URL=https://assets.gditc.org
```

### 2. 安装R2插件：
```bash
npm install @strapi/provider-upload-cloudflare-r2
```

### 3. 插件配置：
```javascript
// config/plugins.js
module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'cloudflare-r2',
            providerOptions: {
                accessKeyId: env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
                secretAccessKey: env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
                endpoint: env('CLOUDFLARE_R2_ENDPOINT'),
                params: {
                    Bucket: env('CLOUDFLARE_R2_BUCKET'),
                },
                cloudflarePublicAccessUrl: env('CLOUDFLARE_R2_PUBLIC_URL'),
            },
        },
    },
});
```

## 🎯 URL转换效果

### 方案一（主域名）：
```
原始：https://wonderful-serenity-47deffe3a2.media.strapiapp.com/33333_e82c3195ef.jpg
转换：https://gditc.org/uploads/33333_e82c3195ef.jpg
```

### 方案二（CDN子域名）：
```
原始：https://wonderful-serenity-47deffe3a2.media.strapiapp.com/33333_e82c3195ef.jpg
转换：https://cdn.gditc.org/uploads/33333_e82c3195ef.jpg
```

### 方案三（R2存储）：
```
原始：https://wonderful-serenity-47deffe3a2.media.strapiapp.com/33333_e82c3195ef.jpg
转换：https://assets.gditc.org/33333_e82c3195ef.jpg
```

## 🔧 Cloudflare优化配置

### 1. 缓存规则（Page Rules）：
在Cloudflare控制台设置：
```
Pattern: gditc.org/uploads/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 day
```

### 2. 压缩优化：
启用以下功能：
- ✅ Auto Minify (CSS, HTML, JS)
- ✅ Brotli压缩
- ✅ Polish (图片优化)

### 3. 图片优化：
```
Polish: Lossless
WebP: Enabled
AVIF: Enabled
```

### 4. 安全头配置：
```javascript
// 在 config/middlewares.js 中添加
module.exports = [
  // ... 其他中间件
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'https://gditc.org',
            'https://cdn.gditc.org' // 如果使用CDN子域名
          ],
          'media-src': ["'self'", 'data:', 'blob:', 'https://gditc.org'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
```

## 🚀 部署建议

### 1. 文件同步策略：
- **Cloudflare Pages**: 自动同步
- **手动部署**: 使用rsync或CI/CD pipeline
- **R2存储**: 直接上传到R2 bucket

### 2. DNS配置：
```
A     gditc.org         -> 192.0.2.1 (Cloudflare代理)
CNAME cdn.gditc.org     -> gditc.org (Cloudflare代理)
CNAME assets.gditc.org  -> your-bucket.r2.cloudflarestorage.com
```

### 3. SSL配置：
- 使用Cloudflare的Universal SSL
- 设置SSL/TLS加密模式为"Full"或"Full (strict)"

## 🛠️ 故障排除

### 1. 404错误：
- 检查文件是否存在于服务器
- 验证URL路径是否正确
- 确认Cloudflare代理状态

### 2. 缓存问题：
- 清除Cloudflare缓存
- 检查Cache Rules配置
- 验证Cache-Control头

### 3. CORS错误：
在Strapi中配置CORS：
```javascript
// config/middlewares.js
module.exports = [
  // ... 其他中间件
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://gditc.org', 'https://cdn.gditc.org'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
];
```

## 📊 推荐方案选择

| 场景 | 推荐方案 | 复杂度 | 性能 |
|------|----------|-------|------|
| 简单部署 | 方案一（主域名） | 低 | 高 |
| 专业分离 | 方案二（CDN子域名） | 中 | 高 |
| 大规模应用 | 方案三（R2存储） | 高 | 最高 |

## 🎉 完成

选择适合您项目的方案，配置完成后重启Strapi服务即可享受Cloudflare的全球CDN加速！ 