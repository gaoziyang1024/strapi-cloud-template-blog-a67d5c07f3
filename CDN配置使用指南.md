# CDN配置使用指南

## 概述

本指南将帮助您为GDITE Strapi项目配置CDN（内容分发网络），以优化图片和媒体文件的加载速度。

## 配置步骤

### 1. 环境变量配置

在您的`.env`文件中添加以下配置：

```env
# CDN基础配置
CDN_ENABLED=true
CDN_BASE_URL=https://your-cdn.example.com
CDN_IMAGE_PATH=/images
CDN_OPTIMIZATION=true
```

### 2. 配置示例

#### AWS CloudFront
```env
CDN_ENABLED=true
CDN_BASE_URL=https://d1234567890.cloudfront.net
CDN_IMAGE_PATH=/uploads
CDN_OPTIMIZATION=true
```

#### 阿里云CDN
```env
CDN_ENABLED=true
CDN_BASE_URL=https://your-domain.alicdn.com
CDN_IMAGE_PATH=/assets
CDN_OPTIMIZATION=true
```

#### 腾讯云CDN
```env
CDN_ENABLED=true
CDN_BASE_URL=https://your-domain.file.myqcloud.com
CDN_IMAGE_PATH=/uploads
CDN_OPTIMIZATION=true
```

### 3. 组件配置

系统已经创建了以下组件来支持CDN配置：

#### CDN配置组件 (`common.cdn-config`)
- `baseUrl`: CDN基础地址
- `imagePath`: 图片路径前缀
- `isEnabled`: 是否启用CDN
- `allowedDomains`: 允许的CDN域名列表
- `cacheSettings`: 缓存设置配置

#### 图片CDN组件 (`common.image-cdn`)
- `originalUrl`: 原始图片地址
- `cdnUrl`: CDN图片地址
- `thumbnailUrl`: 缩略图CDN地址
- `altText`: 图片替代文本
- `sizes`: 不同尺寸的CDN地址配置
- `isOptimized`: 是否已优化

## 使用方法

### 1. 在管理后台配置CDN

1. 登录Strapi管理后台
2. 导航至"全局配置" (Global)
3. 在"CDN配置"部分设置：
   - 基础URL: 您的CDN域名
   - 图片路径: CDN上的图片路径前缀
   - 启用状态: 开启/关闭CDN

### 2. API使用

#### 获取CDN配置
```http
GET /api/global/cdn-config?locale=zh-Hans
```

#### 更新全局配置（包含CDN）
```http
PUT /api/global
Content-Type: application/json

{
  "data": {
    "siteName": "GDITE官方网站",
    "cdnConfig": {
      "baseUrl": "https://cdn.example.com",
      "imagePath": "/images",
      "isEnabled": true,
      "allowedDomains": ["cdn.example.com", "backup-cdn.example.com"],
      "cacheSettings": {
        "maxAge": 3600,
        "publicCache": true
      }
    }
  }
}
```

### 3. 前端使用示例

当CDN配置启用后，API返回的图片对象将包含额外的CDN URL字段：

```javascript
// API响应示例
{
  "data": {
    "attributes": {
      "cover": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "image.jpg",
            "url": "/uploads/image.jpg",           // 原始URL
            "cdnUrl": "https://cdn.example.com/images/uploads/image.jpg", // CDN URL
            "originalUrl": "/uploads/image.jpg"    // 备份的原始URL
          }
        }
      }
    }
  }
}
```

#### React组件使用示例
```jsx
function ImageComponent({ imageData }) {
  const imageUrl = imageData?.cdnUrl || imageData?.url;
  
  return (
    <img 
      src={imageUrl} 
      alt={imageData?.alternativeText}
      loading="lazy"
    />
  );
}
```

#### Vue组件使用示例
```vue
<template>
  <img 
    :src="imageUrl" 
    :alt="imageData?.alternativeText"
    loading="lazy"
  />
</template>

<script>
export default {
  props: ['imageData'],
  computed: {
    imageUrl() {
      return this.imageData?.cdnUrl || this.imageData?.url;
    }
  }
}
</script>
```

## 自动功能

### 1. URL自动转换
- 上传文件时自动生成CDN URL
- 现有文件在启用CDN后自动获得CDN URL
- 支持回退到原始URL（当CDN不可用时）

### 2. 多尺寸支持
系统支持生成不同尺寸的CDN URL（如果您的CDN支持动态尺寸调整）：

```javascript
// 生成的多尺寸URL示例
{
  "original": "https://cdn.example.com/images/uploads/image.jpg",
  "small": "https://cdn.example.com/images/uploads/image.jpg?size=small",
  "medium": "https://cdn.example.com/images/uploads/image.jpg?size=medium",
  "large": "https://cdn.example.com/images/uploads/image.jpg?size=large"
}
```

### 3. 缓存优化
- 自动添加合适的缓存头
- 支持CDN缓存刷新
- 版本控制支持

## 故障排除

### 常见问题

1. **CDN URL无法访问**
   - 检查CDN配置是否正确
   - 确认CDN服务是否正常运行
   - 验证文件是否已同步到CDN

2. **图片加载缓慢**
   - 检查CDN节点覆盖
   - 优化图片格式和大小
   - 启用CDN压缩功能

3. **配置不生效**
   - 重启Strapi应用
   - 清除CDN缓存
   - 检查环境变量配置

### 调试模式

在开发环境中，您可以通过以下方式调试CDN配置：

```javascript
// 在控制器中添加调试信息
console.log('CDN配置:', strapi.config.get('plugin.upload.cdn'));
```

## 最佳实践

1. **选择合适的CDN提供商**
   - 考虑目标用户的地理位置
   - 评估成本效益
   - 确保可靠性和稳定性

2. **优化缓存策略**
   - 设置合适的缓存过期时间
   - 使用版本控制避免缓存问题
   - 配置缓存刷新机制

3. **监控和维护**
   - 定期检查CDN性能
   - 监控错误率和响应时间
   - 保持备份方案

4. **安全考虑**
   - 配置适当的CORS策略
   - 使用HTTPS传输
   - 限制访问来源（如果需要）

## 支持的CDN服务商

- AWS CloudFront
- 阿里云CDN
- 腾讯云CDN
- 百度云CDN
- Azure CDN
- Cloudflare
- 七牛云
- 又拍云
- 自建CDN服务

## 注意事项

1. 启用CDN后，请确保您的CDN服务配置正确
2. 建议在生产环境启用前先在测试环境验证
3. 保留原始URL作为备份方案
4. 定期检查CDN同步状态
5. 考虑CDN成本和带宽使用情况 