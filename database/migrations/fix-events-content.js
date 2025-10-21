/**
 * 修复events表content字段的迁移脚本
 * 在Strapi自动迁移之前运行此脚本
 */

'use strict';

module.exports = {
  async up(knex) {
    console.log('🔧 开始修复events表的content字段...');
    
    try {
      // 1. 检查当前表结构
      const hasContentColumn = await knex.schema.hasColumn('events', 'content');
      if (!hasContentColumn) {
        console.log('📝 events表没有content字段，跳过修复');
        return;
      }

      // 2. 获取所有有问题的记录
      const problematicRecords = await knex('events')
        .select('id', 'content')
        .whereNotNull('content')
        .where(function() {
          this.where('content', '')
            .orWhere('content', 'null')
            .orWhere('content', 'undefined')
            .orWhere('content', 'not like', '{%')
            .orWhere('content', 'not like', '[%');
        });

      console.log(`📊 找到 ${problematicRecords.length} 条需要修复的记录`);

      // 3. 修复每条记录
      for (const record of problematicRecords) {
        let fixedContent;
        
        try {
          // 尝试解析现有内容
          if (typeof record.content === 'string') {
            JSON.parse(record.content);
            // 如果解析成功，跳过
            continue;
          }
        } catch (parseError) {
          // 解析失败，需要修复
          console.log(`🔧 修复记录 ${record.id}: ${parseError.message}`);
          
          // 创建默认的富文本结构
          fixedContent = JSON.stringify({
            blocks: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: record.content || '内容已修复'
                  }
                ]
              }
            ]
          });
          
          // 更新记录
          await knex('events')
            .where('id', record.id)
            .update({ content: fixedContent });
            
          console.log(`✅ 记录 ${record.id} 已修复`);
        }
      }

      // 4. 处理NULL值
      await knex('events')
        .whereNull('content')
        .update({
          content: JSON.stringify({
            blocks: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '默认内容'
                  }
                ]
              }
            ]
          })
        });

      console.log('🎉 events表content字段修复完成！');
      
    } catch (error) {
      console.error('💥 修复过程中出现错误:', error);
      throw error;
    }
  },

  async down(knex) {
    console.log('🔄 回滚events表content字段修复...');
    // 这里可以实现回滚逻辑，如果需要的话
  }
};
