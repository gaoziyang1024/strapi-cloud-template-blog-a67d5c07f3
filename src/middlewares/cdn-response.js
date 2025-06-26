'use strict';

/**
 * CDN响应处理中间件
 * 自动将API响应中的媒体URL转换为CDN URL
 */

module.exports = (config = {}, { strapi }) => {
  return async (ctx, next) => {
    await next();

    // 只处理JSON响应
    if (!ctx.response || ctx.response.type !== 'application/json') {
      return;
    }

    // 获取CDN配置
    const cdnConfig = strapi?.config?.get('plugin.upload.cdn', {}) || {};
    
    if (!cdnConfig.enabled || !cdnConfig.baseUrl) {
      return;
    }

    try {
      // 处理响应体中的媒体URL
      if (ctx.body && typeof ctx.body === 'object') {
        ctx.body = processMediaUrls(ctx.body, cdnConfig);
      }
    } catch (error) {
      strapi?.log?.error('CDN响应处理中间件错误:', error);
    }
  };
};

/**
 * 递归处理对象中的媒体URL
 * @param {any} obj - 要处理的对象
 * @param {Object} cdnConfig - CDN配置
 * @returns {any} 处理后的对象
 */
function processMediaUrls(obj, cdnConfig) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => processMediaUrls(item, cdnConfig));
  }

  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'url' && typeof value === 'string') {
      // 处理本地路径 (如 /uploads/xxx.jpg)
      if (value.startsWith('/uploads/')) {
        result[key] = value;
        result.cdnUrl = `${cdnConfig.baseUrl}${cdnConfig.imagePath}${value}`;
        result.originalUrl = value;
      }
      // 处理Strapi云托管的完整URL
      else if (value.includes('.media.strapiapp.com/')) {
        result[key] = value;
        // 提取文件名部分
        const fileName = value.split('/').pop();
        result.cdnUrl = `${cdnConfig.baseUrl}${cdnConfig.imagePath}/${fileName}`;
        result.originalUrl = value;
      }
      // 处理其他完整URL
      else if (value.startsWith('http')) {
        result[key] = value;
        const fileName = value.split('/').pop();
        result.cdnUrl = `${cdnConfig.baseUrl}${cdnConfig.imagePath}/${fileName}`;
        result.originalUrl = value;
      }
      // 其他情况保持原样
      else {
        result[key] = value;
      }
    } else if (value && typeof value === 'object') {
      result[key] = processMediaUrls(value, cdnConfig);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * 检查对象是否为媒体文件对象
 * @param {Object} obj - 要检查的对象
 * @returns {boolean} 是否为媒体文件对象
 */
function isMediaObject(obj) {
  return obj && 
         typeof obj === 'object' && 
         'url' in obj && 
         'mime' in obj &&
         'size' in obj;
}

/**
 * 处理媒体文件对象
 * @param {Object} mediaObj - 媒体文件对象
 * @param {Object} cdnConfig - CDN配置
 * @returns {Object} 处理后的媒体文件对象
 */
function processMediaObject(mediaObj, cdnConfig) {
  if (!isMediaObject(mediaObj)) {
    return mediaObj;
  }

  const processed = { ...mediaObj };

  // 添加CDN URL
  if (processed.url && processed.url.startsWith('/uploads/')) {
    processed.cdnUrl = `${cdnConfig.baseUrl}${cdnConfig.imagePath}${processed.url}`;
    processed.originalUrl = processed.url;
    
    // 处理不同格式的图片
    if (processed.formats && typeof processed.formats === 'object') {
      for (const [formatName, formatData] of Object.entries(processed.formats)) {
        if (formatData && formatData.url) {
          processed.formats[formatName] = {
            ...formatData,
            cdnUrl: `${cdnConfig.baseUrl}${cdnConfig.imagePath}${formatData.url}`,
            originalUrl: formatData.url
          };
        }
      }
    }
  }

  return processed;
} 