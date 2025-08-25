const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

// GET /api/paiements (pour correspondre au frontend)
router.get('/', async (req, res) => {
  try {
    const [rows] = await getConnection().execute(`
      SELECT p.*, s.nom, s.prenom 
      FROM payments p 
      JOIN students s ON p.studentId = s.id 
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/paiements
router.post('/', async (req, res) => {
  try {
    const { studentId, montant, type, statut, dateEcheance, datePaiement, recu } = req.body;
    const [result] = await getConnection().execute(
      'INSERT INTO payments (studentId, montant, type, statut, dateEcheance, datePaiement, recu) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [studentId, montant, type, statut, dateEcheance, datePaiement, recu]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/paiements/:id
router.put('/:id', async (req, res) => {
  try {
    const { studentId, montant, type, statut, dateEcheance, datePaiement, recu } = req.body;
    await getConnection().execute(
      'UPDATE payments SET studentId = ?, montant = ?, type = ?, statut = ?, dateEcheance = ?, datePaiement = ?, recu = ? WHERE id = ?',
      [studentId, montant, type, statut, dateEcheance, datePaiement, recu, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/paiements/:id
router.delete('/:id', async (req, res) => {
  try {
    await getConnection().execute('DELETE FROM payments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Paiement supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;