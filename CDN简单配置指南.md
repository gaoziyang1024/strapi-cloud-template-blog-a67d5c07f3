# CDN简单配置指南

## 🎯 简单CDN配置方法

这是使用Strapi内置功能直接替换上传文件URL的简单方法，无需复杂的自定义代码。

## ⚙️ 配置步骤

### 1. 环境变量配置

在您的 `.env` 文件中添加：

```env
# CDN基础URL
CDN_BASE_URL=https://top.gditc.com
```

### 2. 插件配置

文件 `config/plugins.js` 已配置如下：

```javascript
module.exports = ({ env }) => ({
    // 其他配置...
    
    upload: {
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 100000000, // 100MB
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
            // CDN URL 替换配置
            action: {
                url: ({ env }) => env('CDN_BASE_URL', 'https://top.gditc.com'),
            },
        },
    }
});
```

## 🚀 工作原理

### URL转换效果

**原始Strapi云托管地址**：
```
https://wonderful-serenity-47deffe3a2.media.strapiapp.com/33333_e82c3195ef.jpg
```

**配置后返回的地址**：
```
https://top.gditc.com/33333_e82c3195ef.jpg
```

### API响应示例

上传文件后，API直接返回CDN地址：

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "33333_e82c3195ef.jpg",
      "url": "https://top.gditc.com/33333_e82c3195ef.jpg",
      "mime": "image/jpeg",
      "size": 123456
    }
  }
}
```

## 📱 前端使用

由于API直接返回CDN URL，前端使用非常简单：

```javascript
// React 示例
function Image({ imageData }) {
  return (
    <img 
      src={imageData.url}  // 直接使用，已经是CDN地址
      alt={imageData.alternativeText}
      loading="lazy"
    />
  );
}

// Vue 示例
<template>
  <img 
    :src="imageData.url"  
    :alt="imageData.alternativeText"
    loading="lazy"
  />
</template>
```

## ✅ 优势

1. **简单直接** - 只需几行配置
2. **无需额外代码** - 使用Strapi内置功能
3. **兼容性好** - 标准的Strapi配置方式
4. **性能优秀** - 没有额外的处理开销

## 🔧 CDN服务器配置

确保您的CDN服务器 `https://top.gditc.com` 已配置好：

1. **原文件同步** - 将Strapi上传的文件同步到CDN
2. **路径映射** - 确保文件路径与原始路径一致
3. **CORS配置** - 如果需要跨域访问
4. **缓存策略** - 设置合适的缓存头

## 🔄 文件同步

您需要确保上传到Strapi的文件能够同步到CDN服务器。常见方法：

1. **实时同步** - 使用webhooks在文件上传时同步
2. **定时同步** - 定期将文件从Strapi同步到CDN
3. **手动同步** - 手动上传文件到CDN服务器

## 🛠️ 故障排除

### 常见问题

1. **图片无法加载**
   - 检查CDN服务器是否正常运行
   - 确认文件是否已同步到CDN
   - 验证CDN_BASE_URL是否正确

2. **配置不生效**
   - 重启Strapi应用
   - 检查环境变量是否正确设置
   - 确认plugins.js配置语法正确

### 测试方法

1. **上传测试文件**
2. **检查返回的URL**
3. **访问CDN地址验证**

## 📝 注意事项

1. **环境变量** - 确保生产环境也设置了CDN_BASE_URL
2. **文件同步** - 确保CDN服务器有对应的文件
3. **备份策略** - 保持原始文件的备份
4. **监控** - 监控CDN服务的可用性

## 🎉 完成

现在您的Strapi已配置为使用简单的CDN URL替换方法！所有上传的文件都会自动返回您的CDN地址。 