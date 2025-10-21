/**
 * 快速修复数据库JSON问题的脚本
 * 直接执行SQL命令修复数据
 */

const { Client } = require('pg');
require('dotenv').config();

async function quickFixDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/strapi',
  });

  try {
    await client.connect();
    console.log('🔗 已连接到数据库');

    // 1. 修复events表的content字段
    console.log('🔧 修复events表...');
    
    // 设置默认的富文本JSON结构
    const defaultContent = JSON.stringify({
      blocks: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: '内容已修复'
            }
          ]
        }
      ]
    });

    // 修复NULL、空字符串和无效值
    const updateQuery = `
      UPDATE events 
      SET content = $1
      WHERE content IS NULL 
         OR content = '' 
         OR content = 'null'
         OR content = 'undefined'
         OR content NOT LIKE '{%'
         OR content NOT LIKE '[%'
    `;
    
    const result = await client.query(updateQuery, [defaultContent]);
    console.log(`✅ 已修复 ${result.rowCount} 条events记录`);

    // 2. 检查其他表
    const tables = ['articles', 'standards', 'certifications', 'trainings'];
    
    for (const table of tables) {
      try {
        // 检查表是否存在
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          )
        `, [table]);
        
        if (tableExists.rows[0].exists) {
          // 检查是否有content字段
          const columnExists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.columns 
              WHERE table_name = $1 AND column_name = 'content'
            )
          `, [table]);
          
          if (columnExists.rows[0].exists) {
            const updateResult = await client.query(`
              UPDATE ${table} 
              SET content = $1
              WHERE content IS NULL 
                 OR content = '' 
                 OR content = 'null'
                 OR content = 'undefined'
                 OR content NOT LIKE '{%'
                 OR content NOT LIKE '[%'
            `, [defaultContent]);
            
            console.log(`✅ 已修复 ${updateResult.rowCount} 条${table}记录`);
          }
        }
      } catch (error) {
        console.log(`⚠️ 跳过${table}表: ${error.message}`);
      }
    }

    // 3. 验证修复结果
    console.log('🔍 验证修复结果...');
    
    const verifyQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN content IS NULL THEN 1 END) as null_count,
        COUNT(CASE WHEN content = '' THEN 1 END) as empty_count
      FROM events
    `;
    
    const verifyResult = await client.query(verifyQuery);
    const stats = verifyResult.rows[0];
    
    console.log(`📊 Events表统计:`);
    console.log(`   - 总记录数: ${stats.total}`);
    console.log(`   - NULL记录: ${stats.null_count}`);
    console.log(`   - 空记录: ${stats.empty_count}`);

    // 4. 测试JSON转换
    try {
      await client.query(`
        SELECT content::jsonb 
        FROM events 
        WHERE content IS NOT NULL 
        LIMIT 1
      `);
      console.log('✅ JSON转换测试通过');
    } catch (error) {
      console.log('❌ JSON转换测试失败:', error.message);
      throw error;
    }

    console.log('🎉 数据库修复完成！现在可以安全部署了。');

  } catch (error) {
    console.error('💥 修复过程中出现错误:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行修复
if (require.main === module) {
  quickFixDatabase()
    .then(() => {
      console.log('✅ 修复完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 修复失败:', error);
      process.exit(1);
    });
}

module.exports = { quickFixDatabase };
