'use strict';

/**
 *  global controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::global.global', ({ strapi }) => ({
  /**
   * 获取CDN配置
   */
  async getCdnConfig(ctx) {
    try {
      const entity = await strapi.entityService.findMany('api::global.global', {
        populate: ['cdnConfig'],
        locale: ctx.query.locale || 'zh-Hans'
      });

      const cdnConfig = entity?.cdnConfig || null;
      
      ctx.body = {
        data: cdnConfig,
        meta: {}
      };
    } catch (error) {
      ctx.throw(500, '获取CDN配置失败');
    }
  }
}));
