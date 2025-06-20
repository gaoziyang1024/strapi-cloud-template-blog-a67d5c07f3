'use strict';

/**
 * newsroom service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newsroom.newsroom');
