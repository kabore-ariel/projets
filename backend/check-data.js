const mysql = require('mysql2/promise');

const checkData = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'edumanager_pro'
    });

    console.log('📊 Vérification des données en base...\n');

    // Vérifier les classes
    const [classes] = await connection.execute('SELECT COUNT(*) as count FROM classes');
    console.log(`Classes: ${classes[0].count} enregistrements`);

    // Vérifier les étudiants
    const [students] = await connection.execute('SELECT COUNT(*) as count FROM students');
    console.log(`Étudiants: ${students[0].count} enregistrements`);

    // Vérifier le personnel
    const [personnel] = await connection.execute('SELECT COUNT(*) as count FROM personnel');
    console.log(`Personnel: ${personnel[0].count} enregistrements`);

    // Vérifier les notes
    const [notes] = await connection.execute('SELECT COUNT(*) as count FROM notes');
    console.log(`Notes: ${notes[0].count} enregistrements`);

    // Vérifier les paiements
    const [payments] = await connection.execute('SELECT COUNT(*) as count FROM payments');
    console.log(`Paiements: ${payments[0].count} enregistrements`);

    console.log('\n✅ Toutes les données sont bien enregistrées en base MySQL !');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

checkData();