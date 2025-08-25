const { getConnection } = require('../database');

const seedData = async () => {
  const connection = getConnection();
  
  try {
    // Insérer des classes
    await connection.execute(`
      INSERT IGNORE INTO classes (id, nom, niveau, section, effectifMax, salle, description) VALUES
      (1, '6ème A', '6ème', 'A', 30, 'Salle 101', 'Classe de 6ème section A'),
      (2, '5ème B', '5ème', 'B', 28, 'Salle 205', 'Classe de 5ème section B'),
      (3, '4ème C', '4ème', 'C', 30, 'Salle 301', 'Classe de 4ème section C')
    `);

    // Insérer des étudiants
    await connection.execute(`
      INSERT IGNORE INTO students (id, nom, prenom, dateNaissance, classeId, telephone, adresse) VALUES
      (1, 'Dupont', 'Jean', '2010-05-15', 1, '0123456789', '123 Rue de la Paix, Abidjan'),
      (2, 'Martin', 'Marie', '2010-08-22', 1, '0987654321', '456 Avenue des Fleurs, Abidjan'),
      (3, 'Kouassi', 'Aya', '2009-03-10', 2, '0555123456', '789 Boulevard Principal, Abidjan')
    `);
    
    // Ajouter une colonne notes JSON si elle n'existe pas
    await connection.execute(`
      ALTER TABLE students ADD COLUMN IF NOT EXISTS notes JSON DEFAULT '{}'
    `);
    
    // Mettre à jour les notes par défaut
    await connection.execute(`
      UPDATE students SET notes = JSON_OBJECT(
        'mathematiques', JSON_ARRAY(15, 12, 18, 14),
        'francais', JSON_ARRAY(16, 14, 15, 17),
        'histoire', JSON_ARRAY(13, 15, 12, 16)
      ) WHERE id = 1 AND (notes IS NULL OR JSON_LENGTH(notes) = 0)
    `);
    
    await connection.execute(`
      UPDATE students SET notes = JSON_OBJECT(
        'mathematiques', JSON_ARRAY(14, 16, 13, 15),
        'francais', JSON_ARRAY(18, 17, 16, 19),
        'sciences', JSON_ARRAY(16, 15, 17, 14)
      ) WHERE id = 2 AND (notes IS NULL OR JSON_LENGTH(notes) = 0)
    `);
    
    await connection.execute(`
      UPDATE students SET notes = JSON_OBJECT(
        'mathematiques', JSON_ARRAY(12, 14, 11, 13),
        'francais', JSON_ARRAY(15, 13, 16, 14)
      ) WHERE id = 3 AND (notes IS NULL OR JSON_LENGTH(notes) = 0)
    `);

    // Insérer du personnel
    await connection.execute(`
      INSERT IGNORE INTO personnel (id, nom, prenom, poste, telephone, email, salaire) VALUES
      (1, 'Professeur', 'Alice', 'Enseignant Mathématiques', '123456789', 'alice@ecole.com', 450000),
      (2, 'Directeur', 'Bob', 'Directeur', '987654321', 'bob@ecole.com', 800000),
      (3, 'Secrétaire', 'Claire', 'Secrétaire', '456789123', 'claire@ecole.com', 300000)
    `);

    // Insérer des notes
    await connection.execute(`
      INSERT IGNORE INTO notes (studentId, matiere, note, coefficient, trimestre) VALUES
      (1, 'Mathématiques', 15.5, 4, 'Trimestre 1'),
      (1, 'Français', 16.0, 4, 'Trimestre 1'),
      (1, 'Histoire-Géographie', 13.5, 3, 'Trimestre 1'),
      (2, 'Mathématiques', 14.0, 4, 'Trimestre 1'),
      (2, 'Français', 18.0, 4, 'Trimestre 1'),
      (3, 'Mathématiques', 12.5, 4, 'Trimestre 1')
    `);

    // Insérer des matières
    await connection.execute(`
      INSERT IGNORE INTO matieres (id, nom, coefficient, classeId) VALUES
      (1, 'Mathématiques', 4, 1),
      (2, 'Français', 4, 1),
      (3, 'Histoire-Géographie', 3, 1),
      (4, 'Sciences', 3, 1),
      (5, 'Anglais', 2, 1),
      (6, 'Mathématiques', 4, 2),
      (7, 'Français', 4, 2),
      (8, 'Sciences Physiques', 3, 2)
    `);

    // Insérer des paiements
    await connection.execute(`
      INSERT IGNORE INTO payments (studentId, montant, type, statut, dateEcheance, datePaiement) VALUES
      (1, 150000, 'Scolarité', 'paye', '2024-01-15', '2024-01-10'),
      (2, 150000, 'Scolarité', 'en_attente', '2024-01-15', NULL),
      (3, 150000, 'Scolarité', 'paye', '2024-01-15', '2024-01-12')
    `);

    console.log('✅ Données de test insérées');
  } catch (error) {
    console.error('❌ Erreur insertion données:', error.message);
  }
};

module.exports = { seedData };