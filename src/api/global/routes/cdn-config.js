'use strict';

/**
 * CDN配置自定义路由
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/global/cdn-config',
      handler: 'global.getCdnConfig',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 