const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

// GET /api/matieres
router.get('/', async (req, res) => {
  try {
    const [rows] = await getConnection().execute(`
      SELECT m.*, c.nom as classe_nom 
      FROM matieres m 
      LEFT JOIN classes c ON m.classeId = c.id 
      ORDER BY m.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/matieres/classe/:classeId
router.get('/classe/:classeId', async (req, res) => {
  try {
    const [rows] = await getConnection().execute(
      'SELECT * FROM matieres WHERE classeId = ? ORDER BY nom',
      [req.params.classeId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/matieres
router.post('/', async (req, res) => {
  try {
    const { nom, coefficient, classeId } = req.body;
    const [result] = await getConnection().execute(
      'INSERT INTO matieres (nom, coefficient, classeId) VALUES (?, ?, ?)',
      [nom, coefficient, classeId]
    );
    res.status(201).json({ id: result.insertId, nom, coefficient, classeId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/matieres/:id
router.put('/:id', async (req, res) => {
  try {
    const { nom, coefficient, classeId } = req.body;
    await getConnection().execute(
      'UPDATE matieres SET nom = ?, coefficient = ?, classeId = ? WHERE id = ?',
      [nom, coefficient, classeId, req.params.id]
    );
    res.json({ id: req.params.id, nom, coefficient, classeId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/matieres/:id
router.delete('/:id', async (req, res) => {
  try {
    await getConnection().execute('DELETE FROM matieres WHERE id = ?', [req.params.id]);
    res.json({ message: 'Matière supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;