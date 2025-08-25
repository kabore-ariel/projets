const mysql = require('mysql2/promise');

const resetDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Supprimer et recréer la base
    await connection.execute('DROP DATABASE IF EXISTS edumanager_pro');
    await connection.execute('CREATE DATABASE edumanager_pro');
    console.log('✅ Base de données réinitialisée');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

resetDatabase();