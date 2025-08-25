-- Insertion des données de test pour EduManager

-- Personnel
INSERT INTO personnel (nom, prenom, poste, matiere, salaire, telephone, email, avatar_url, statut, created_at, updated_at, version) VALUES
('Professeur', 'Alice', 'ENSEIGNANT', 'Mathématiques', 150000.00, '123456789', 'alice@ecole.com', '/placeholder.svg?height=40&width=40', 'ACTIF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Directeur', 'Bob', 'DIRECTION', 'Administration', 200000.00, '987654321', 'bob@ecole.com', '/placeholder.svg?height=40&width=40', 'ACTIF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Kone', 'Fatou', 'ENSEIGNANT', 'Français', 145000.00, '111222333', 'fatou@ecole.com', '/placeholder.svg?height=40&width=40', 'ACTIF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Traore', 'Mamadou', 'ENSEIGNANT', 'Histoire-Géographie', 140000.00, '444555666', 'mamadou@ecole.com', '/placeholder.svg?height=40&width=40', 'ACTIF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Ouattara', 'Aminata', 'ENSEIGNANT', 'Sciences Physiques', 148000.00, '777888999', 'aminata@ecole.com', '/placeholder.svg?height=40&width=40', 'ACTIF', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Classes
INSERT INTO classes (nom, niveau, section, effectif_max, salle, description, enseignant_principal_id, created_at, updated_at, version) VALUES
('6ème A', '6ème', 'A', 30, 'Salle 101', 'Classe de 6ème section A', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('5ème B', '5ème', 'B', 28, 'Salle 205', 'Classe de 5ème section B', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('4ème A', '4ème', 'A', 32, 'Salle 301', 'Classe de 4ème section A', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('3ème C', '3ème', 'C', 25, 'Salle 402', 'Classe de 3ème section C', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Élèves
INSERT INTO eleves (nom, prenom, date_naissance, adresse, telephone, email, avatar_url, statut, classe_id, created_at, updated_at, version) VALUES
('Dupont', 'Jean', '2010-05-15', '123 Rue de la Paix, Abidjan', '0123456789', 'jean.dupont@email.com', '/placeholder.svg?height=40&width=40', 'ACTIF', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Martin', 'Marie', '2010-08-22', '456 Avenue des Fleurs, Abidjan', '0987654321', 'marie.martin@email.com', '/placeholder.svg?height=40&width=40', 'ACTIF', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Kouassi', 'Aya', '2008-12-10', '789 Boulevard du Commerce, Abidjan', '0555666777', 'aya.kouassi@email.com', '/placeholder.svg?height=40&width=40', 'ACTIF', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Bamba', 'Sekou', '2009-03-18', '321 Rue des Palmiers, Abidjan', '0111222333', 'sekou.bamba@email.com', '/placeholder.svg?height=40&width=40', 'ACTIF', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
('Diallo', 'Fatoumata', '2007-11-25', '654 Avenue de la République, Abidjan', '0999888777', 'fatoumata.diallo@email.com', '/placeholder.svg?height=40&width=40', 'ACTIF', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Notes
INSERT INTO notes (valeur, matiere, type_evaluation, date_evaluation, commentaire, trimestre, eleve_id, enseignant_id, created_at, updated_at, version) VALUES
-- Notes pour Jean Dupont (6ème A)
(15.00, 'Mathématiques', 'DEVOIR_SURVEILLE', '2024-09-15', 'Bon travail', 'PREMIER', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(12.00, 'Mathématiques', 'CONTROLE_CONTINU', '2024-10-05', 'Peut mieux faire', 'PREMIER', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(18.00, 'Mathématiques', 'EXAMEN', '2024-10-20', 'Excellent', 'PREMIER', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(16.00, 'Français', 'DEVOIR_MAISON', '2024-09-20', 'Très bien', 'PREMIER', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(14.00, 'Français', 'ORAL', '2024-10-10', 'Bonne expression', 'PREMIER', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Notes pour Marie Martin (6ème A)
(14.00, 'Mathématiques', 'DEVOIR_SURVEILLE', '2024-09-15', 'Travail correct', 'PREMIER', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(16.00, 'Mathématiques', 'CONTROLE_CONTINU', '2024-10-05', 'Progrès notable', 'PREMIER', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(18.00, 'Français', 'DEVOIR_MAISON', '2024-09-20', 'Excellent travail', 'PREMIER', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(17.00, 'Français', 'ORAL', '2024-10-10', 'Très bonne prestation', 'PREMIER', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Notes pour Aya Kouassi (4ème A)
(18.00, 'Mathématiques', 'DEVOIR_SURVEILLE', '2024-09-15', 'Excellent élève', 'PREMIER', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(17.00, 'Mathématiques', 'CONTROLE_CONTINU', '2024-10-05', 'Très bon niveau', 'PREMIER', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(19.00, 'Histoire-Géographie', 'PROJET', '2024-09-25', 'Travail remarquable', 'PREMIER', 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(16.00, 'Sciences Physiques', 'DEVOIR_SURVEILLE', '2024-10-01', 'Très bien', 'PREMIER', 3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Paiements
INSERT INTO paiements (montant, mois, annee, statut, date_paiement, mode_paiement, reference_transaction, eleve_id, created_at, updated_at, version) VALUES
-- Paiements pour Jean Dupont
(50000.00, 'SEPTEMBRE', 2024, 'PAYE', '2024-09-01', 'ESPECES', 'REF001', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'OCTOBRE', 2024, 'PAYE', '2024-10-01', 'ESPECES', 'REF002', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'NOVEMBRE', 2024, 'EN_ATTENTE', NULL, NULL, NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Paiements pour Marie Martin
(50000.00, 'SEPTEMBRE', 2024, 'PAYE', '2024-09-05', 'CHEQUE', 'REF003', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'OCTOBRE', 2024, 'EN_ATTENTE', NULL, NULL, NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'NOVEMBRE', 2024, 'EN_ATTENTE', NULL, NULL, NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Paiements pour Aya Kouassi
(50000.00, 'SEPTEMBRE', 2024, 'PAYE', '2024-09-03', 'VIREMENT', 'REF004', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'OCTOBRE', 2024, 'PAYE', '2024-10-02', 'VIREMENT', 'REF005', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'NOVEMBRE', 2024, 'PAYE', '2024-11-01', 'VIREMENT', 'REF006', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Paiements pour Sekou Bamba
(50000.00, 'SEPTEMBRE', 2024, 'PAYE', '2024-09-10', 'MOBILE_MONEY', 'REF007', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'OCTOBRE', 2024, 'EN_ATTENTE', NULL, NULL, NULL, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

-- Paiements pour Fatoumata Diallo
(50000.00, 'SEPTEMBRE', 2024, 'PAYE', '2024-09-08', 'CARTE', 'REF008', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'OCTOBRE', 2024, 'PAYE', '2024-10-08', 'CARTE', 'REF009', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
(50000.00, 'NOVEMBRE', 2024, 'EN_ATTENTE', NULL, NULL, NULL, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Associations personnel-classes (enseignants assignés aux classes)
INSERT INTO personnel_classes (personnel_id, classe_id) VALUES
(1, 1), -- Alice enseigne en 6ème A
(1, 2), -- Alice enseigne en 5ème B
(3, 1), -- Fatou enseigne en 6ème A
(3, 2), -- Fatou enseigne en 5ème B
(4, 3), -- Mamadou enseigne en 4ème A
(4, 4), -- Mamadou enseigne en 3ème C
(5, 3), -- Aminata enseigne en 4ème A
(5, 4); -- Aminata enseigne en 3ème C