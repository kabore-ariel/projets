const mysql = require('mysql2/promise');

const createDatabase = async () => {
  try {
    // Connexion sans spécifier la base de données
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Créer la base de données
    await connection.execute('CREATE DATABASE IF NOT EXISTS edumanager_pro');
    console.log('✅ Base de données edumanager_pro créée');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur création base:', error.message);
    process.exit(1);
  }
};

createDatabase();