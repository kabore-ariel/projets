const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'edumanager_pro'
};

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion MySQL établie');
    
    // Créer les tables si elles n'existent pas
    await createTables();
    
    // Exécuter les migrations
    await runMigrations();
  } catch (error) {
    console.error('❌ Erreur connexion MySQL:', error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS classes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      niveau VARCHAR(50) NOT NULL,
      section VARCHAR(10),
      effectifMax INT DEFAULT 30,
      salle VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      prenom VARCHAR(100) NOT NULL,
      dateNaissance DATE,
      classeId INT,
      telephone VARCHAR(20),
      adresse TEXT,
      photo VARCHAR(255),
      notes JSON DEFAULT '{}',
      paiementStatut VARCHAR(20) DEFAULT 'en_attente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classeId) REFERENCES classes(id) ON DELETE SET NULL
    )`,
    
    `CREATE TABLE IF NOT EXISTS personnel (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      prenom VARCHAR(100) NOT NULL,
      poste VARCHAR(100),
      telephone VARCHAR(20),
      email VARCHAR(100),
      salaire DECIMAL(10,2),
      photo VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      studentId INT,
      matiere VARCHAR(100),
      note DECIMAL(4,2),
      coefficient DECIMAL(3,1) DEFAULT 1,
      trimestre VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS matieres (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      coefficient DECIMAL(3,1) DEFAULT 1,
      classeId INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classeId) REFERENCES classes(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      studentId INT,
      montant DECIMAL(10,2),
      type VARCHAR(50),
      statut VARCHAR(20) DEFAULT 'en_attente',
      dateEcheance DATE,
      datePaiement DATE,
      recu VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    )`
  ];

  for (const table of tables) {
    await connection.execute(table);
  }
  console.log('✅ Tables créées/vérifiées');
};

const runMigrations = async () => {
  try {
    const { seedData } = require('./migrations/seed');
    await seedData();
  } catch (error) {
    console.error('❌ Erreur migrations:', error.message);
  }
};

const getConnection = () => {
  if (!connection) {
    throw new Error('Database connection not established');
  }
  return connection;
};

module.exports = { connectDB, getConnection };