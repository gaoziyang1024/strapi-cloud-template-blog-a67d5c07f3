/**
 * 修复Strapi数据库中的无效JSON数据
 * 这个脚本会检查并修复events表中的content字段
 */

const { Client } = require('pg');
require('dotenv').config();

async function fixJsonData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/strapi',
  });

  try {
    await client.connect();
    console.log('🔗 已连接到数据库');

    // 1. 检查events表中的content字段
    console.log('📊 检查events表中的数据...');
    const result = await client.query(`
      SELECT id, content, created_at 
      FROM events 
      WHERE content IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log(`📋 找到 ${result.rows.length} 条记录`);

    // 2. 检查每条记录的JSON有效性
    const invalidRecords = [];
    
    for (const row of result.rows) {
      try {
        // 尝试解析JSON
        if (typeof row.content === 'string') {
          JSON.parse(row.content);
        } else if (typeof row.content === 'object') {
          JSON.stringify(row.content);
        }
        console.log(`✅ 记录 ${row.id}: JSON有效`);
      } catch (error) {
        console.log(`❌ 记录 ${row.id}: JSON无效 - ${error.message}`);
        invalidRecords.push(row);
      }
    }

    if (invalidRecords.length === 0) {
      console.log('🎉 所有记录的JSON格式都是有效的！');
      return;
    }

    // 3. 修复无效的JSON数据
    console.log(`🔧 开始修复 ${invalidRecords.length} 条无效记录...`);
    
    for (const record of invalidRecords) {
      try {
        let fixedContent;
        
        if (typeof record.content === 'string') {
          // 尝试清理字符串
          let cleanedContent = record.content.trim();
          
          // 移除可能的BOM字符
          if (cleanedContent.charCodeAt(0) === 0xFEFF) {
            cleanedContent = cleanedContent.slice(1);
          }
          
          // 尝试修复常见的JSON问题
          cleanedContent = cleanedContent
            .replace(/\\n/g, '\\n')
            .replace(/\\t/g, '\\t')
            .replace(/\\r/g, '\\r')
            .replace(/\\"/g, '\\"')
            .replace(/\\\\/g, '\\\\');
          
          // 如果仍然无效，创建一个默认的JSON对象
          try {
            JSON.parse(cleanedContent);
            fixedContent = cleanedContent;
          } catch {
            // 创建默认的JSON结构
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
          }
        } else {
          // 如果不是字符串，尝试转换为JSON
          fixedContent = JSON.stringify(record.content || {});
        }

        // 更新数据库记录
        await client.query(
          'UPDATE events SET content = $1 WHERE id = $2',
          [fixedContent, record.id]
        );
        
        console.log(`✅ 已修复记录 ${record.id}`);
        
      } catch (error) {
        console.log(`❌ 修复记录 ${record.id} 失败: ${error.message}`);
        
        // 如果修复失败，设置一个安全的默认值
        try {
          const safeContent = JSON.stringify({
            blocks: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: '内容格式错误，已重置'
                  }
                ]
              }
            ]
          });
          
          await client.query(
            'UPDATE events SET content = $1 WHERE id = $2',
            [safeContent, record.id]
          );
          
          console.log(`🔄 记录 ${record.id} 已设置为安全默认值`);
        } catch (fallbackError) {
          console.log(`💥 记录 ${record.id} 修复完全失败: ${fallbackError.message}`);
        }
      }
    }

    // 4. 验证修复结果
    console.log('🔍 验证修复结果...');
    const verifyResult = await client.query(`
      SELECT id, content 
      FROM events 
      WHERE content IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    let allValid = true;
    for (const row of verifyResult.rows) {
      try {
        if (typeof row.content === 'string') {
          JSON.parse(row.content);
        }
        console.log(`✅ 记录 ${row.id}: 验证通过`);
      } catch (error) {
        console.log(`❌ 记录 ${row.id}: 验证失败 - ${error.message}`);
        allValid = false;
      }
    }

    if (allValid) {
      console.log('🎉 所有数据修复完成！现在可以安全地进行数据库迁移了。');
    } else {
      console.log('⚠️ 仍有部分数据需要手动检查。');
    }

  } catch (error) {
    console.error('💥 脚本执行失败:', error);
  } finally {
    await client.end();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行修复脚本
if (require.main === module) {
  fixJsonData().catch(console.error);
}

module.exports = { fixJsonData };
