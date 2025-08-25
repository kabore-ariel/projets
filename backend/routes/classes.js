const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

// GET /api/classes
router.get('/', async (req, res) => {
  try {
    const [rows] = await getConnection().execute('SELECT * FROM classes ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/classes
router.post('/', async (req, res) => {
  try {
    const { nom, niveau, section, effectifMax, salle, description } = req.body;
    const [result] = await getConnection().execute(
      'INSERT INTO classes (nom, niveau, section, effectifMax, salle, description) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, niveau, section || '', effectifMax || 30, salle || '', description || '']
    );
    res.status(201).json({ id: result.insertId, nom, niveau, section, effectifMax, salle, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/classes/:id
router.put('/:id', async (req, res) => {
  try {
    const { nom, niveau, section, effectifMax, salle, description } = req.body;
    await getConnection().execute(
      'UPDATE classes SET nom = ?, niveau = ?, section = ?, effectifMax = ?, salle = ?, description = ? WHERE id = ?',
      [nom, niveau, section, effectifMax, salle, description, req.params.id]
    );
    res.json({ id: req.params.id, nom, niveau, section, effectifMax, salle, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/classes/:id
router.delete('/:id', async (req, res) => {
  try {
    await getConnection().execute('DELETE FROM classes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Classe supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;