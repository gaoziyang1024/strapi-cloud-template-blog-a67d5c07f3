'use strict';

module.exports = (plugin) => {
  // 扩展上传服务以支持CDN
  const originalUpload = plugin.services.upload.upload;
  
  plugin.services.upload.upload = async function (uploadOptions) {
    // 调用原始上传方法
    const result = await originalUpload.call(this, uploadOptions);
    
    // 获取CDN配置
    const cdnConfig = strapi.config.get('plugin.upload.cdn', {});
    
    if (cdnConfig.enabled && cdnConfig.baseUrl) {
      // 为上传的文件添加CDN URL
      if (Array.isArray(result)) {
        result.forEach(file => {
          if (file.url) {
            file.cdnUrl = `${cdnConfig.baseUrl}${cdnConfig.imagePath}${file.url}`;
            file.originalUrl = file.url;
          }
        });
      } else if (result && result.url) {
        result.cdnUrl = `${cdnConfig.baseUrl}${cdnConfig.imagePath}${result.url}`;
        result.originalUrl = result.url;
      }
    }
    
    return result;
  };

  // 添加CDN URL转换服务
  plugin.services['cdn-helper'] = () => ({
    /**
     * 将本地URL转换为CDN URL
     * @param {string} url - 本地文件URL
     * @returns {string} CDN URL
     */
         convertToCdnUrl(url) {
       const cdnConfig = strapi.config.get('plugin.upload.cdn', {});
       
       if (!cdnConfig.enabled || !cdnConfig.baseUrl || !url) {
         return url;
       }
       
       // 如果已经是CDN URL，则直接返回
       if (url.includes(cdnConfig.baseUrl)) {
         return url;
       }
       
       // 处理本地路径
       if (url.startsWith('/uploads/')) {
         return `${cdnConfig.baseUrl}${cdnConfig.imagePath}${url}`;
       }
       
       // 处理Strapi云托管或其他完整URL
       if (url.startsWith('http')) {
         const fileName = url.split('/').pop();
         return `${cdnConfig.baseUrl}${cdnConfig.imagePath}/${fileName}`;
       }
       
       return `${cdnConfig.baseUrl}${cdnConfig.imagePath}/${url}`;
     },

    /**
     * 批量转换URL为CDN URL
     * @param {Array} files - 文件数组
     * @returns {Array} 处理后的文件数组
     */
    processFilesWithCdn(files) {
      if (!files) return files;
      
      const cdnConfig = strapi.config.get('plugin.upload.cdn', {});
      
      if (!cdnConfig.enabled || !cdnConfig.baseUrl) {
        return files;
      }
      
      const processFile = (file) => {
        if (file && file.url) {
          return {
            ...file,
            cdnUrl: this.convertToCdnUrl(file.url),
            originalUrl: file.url
          };
        }
        return file;
      };
      
      return Array.isArray(files) ? files.map(processFile) : processFile(files);
    },

    /**
     * 获取不同尺寸的CDN URL配置
     * @param {string} baseUrl - 基础URL
     * @param {Array} sizes - 尺寸配置
     * @returns {Object} 不同尺寸的URL对象
     */
    generateSizedUrls(baseUrl, sizes = ['small', 'medium', 'large']) {
      const cdnConfig = strapi.config.get('plugin.upload.cdn', {});
      
      if (!cdnConfig.enabled || !cdnConfig.baseUrl) {
        return { original: baseUrl };
      }
      
      const sizedUrls = { original: this.convertToCdnUrl(baseUrl) };
      
      sizes.forEach(size => {
        // 假设CDN支持动态尺寸调整，格式为 ?size=small
        sizedUrls[size] = `${this.convertToCdnUrl(baseUrl)}?size=${size}`;
      });
      
      return sizedUrls;
    }
  });

  return plugin;
}; 