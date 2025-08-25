const mysql = require('mysql2/promise');

const testConnection = async () => {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'edumanager_pro'
  };

  try {
    console.log('🔍 Testing MySQL connection...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL connection successful');
    
    // Test if database exists
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'edumanager_pro');
    
    if (!dbExists) {
      console.log('⚠️  Database edumanager_pro does not exist. Creating...');
      await connection.execute('CREATE DATABASE edumanager_pro');
      console.log('✅ Database created');
    } else {
      console.log('✅ Database edumanager_pro exists');
    }
    
    await connection.end();
    console.log('✅ Connection test completed successfully');
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('💡 Make sure MySQL server is running on localhost:3306');
    console.error('💡 Check if user "root" has access without password');
  }
};

testConnection();