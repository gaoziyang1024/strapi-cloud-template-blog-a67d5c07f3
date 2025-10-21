/**
 * Strapi部署前检查脚本
 * 确保数据库数据完整性，避免迁移失败
 */

const { Client } = require('pg');
require('dotenv').config();

async function preDeployCheck() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/strapi',
  });

  try {
    await client.connect();
    console.log('🔗 已连接到数据库');

    // 1. 检查events表
    console.log('📊 检查events表...');
    const eventsResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN content IS NULL THEN 1 END) as null_content,
        COUNT(CASE WHEN content = '' THEN 1 END) as empty_content,
        COUNT(CASE WHEN content = 'null' THEN 1 END) as null_string,
        COUNT(CASE WHEN content = 'undefined' THEN 1 END) as undefined_string
      FROM events
    `);

    const events = eventsResult.rows[0];
    console.log(`📋 Events表统计:`);
    console.log(`   - 总记录数: ${events.total}`);
    console.log(`   - NULL内容: ${events.null_content}`);
    console.log(`   - 空内容: ${events.empty_content}`);
    console.log(`   - "null"字符串: ${events.null_string}`);
    console.log(`   - "undefined"字符串: ${events.undefined_string}`);

    // 2. 检查其他可能有JSON字段的表
    const tables = ['articles', 'standards', 'certifications', 'trainings'];
    
    for (const table of tables) {
      try {
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = '${table}'
          )
        `);
        
        if (tableExists.rows[0].exists) {
          const result = await client.query(`
            SELECT 
              COUNT(*) as total,
              COUNT(CASE WHEN content IS NULL THEN 1 END) as null_content
            FROM ${table}
          `);
          
          const stats = result.rows[0];
          console.log(`📋 ${table}表统计: 总记录数 ${stats.total}, NULL内容 ${stats.null_content}`);
        }
      } catch (error) {
        console.log(`⚠️ 无法检查${table}表: ${error.message}`);
      }
    }

    // 3. 检查是否有无效的JSON数据
    console.log('🔍 检查JSON数据有效性...');
    
    const invalidJsonQuery = `
      SELECT id, content, created_at
      FROM events 
      WHERE content IS NOT NULL 
      AND content != ''
      AND (
        content = 'null' 
        OR content = 'undefined'
        OR content NOT LIKE '{%'
        OR content NOT LIKE '[%'
      )
      LIMIT 5
    `;
    
    const invalidRecords = await client.query(invalidJsonQuery);
    
    if (invalidRecords.rows.length > 0) {
      console.log('❌ 发现无效的JSON数据:');
      invalidRecords.rows.forEach(record => {
        console.log(`   - 记录 ${record.id}: "${record.content}"`);
      });
      
      console.log('\n🔧 建议执行以下操作:');
      console.log('1. 运行: node fix-json-data.js');
      console.log('2. 或者手动修复数据库中的无效数据');
      console.log('3. 然后重新部署');
      
      return false;
    } else {
      console.log('✅ 所有JSON数据都是有效的');
    }

    // 4. 测试JSON转换
    console.log('🧪 测试JSON转换...');
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
      return false;
    }

    console.log('🎉 部署前检查完成，数据库状态良好！');
    return true;

  } catch (error) {
    console.error('💥 检查过程中出现错误:', error);
    return false;
  } finally {
    await client.end();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行检查
if (require.main === module) {
  preDeployCheck().then(success => {
    if (success) {
      console.log('✅ 可以安全部署');
      process.exit(0);
    } else {
      console.log('❌ 需要修复数据后再部署');
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 检查失败:', error);
    process.exit(1);
  });
}

module.exports = { preDeployCheck };
