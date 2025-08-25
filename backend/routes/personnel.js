const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

// GET /api/personnel
router.get('/', async (req, res) => {
  try {
    const [rows] = await getConnection().execute('SELECT * FROM personnel ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/personnel
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, poste, telephone, email, salaire, photo } = req.body;
    const [result] = await getConnection().execute(
      'INSERT INTO personnel (nom, prenom, poste, telephone, email, salaire, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, poste, telephone, email, salaire, photo]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/personnel/:id
router.put('/:id', async (req, res) => {
  try {
    const { nom, prenom, poste, telephone, email, salaire, photo } = req.body;
    await getConnection().execute(
      'UPDATE personnel SET nom = ?, prenom = ?, poste = ?, telephone = ?, email = ?, salaire = ?, photo = ? WHERE id = ?',
      [nom, prenom, poste, telephone, email, salaire, photo, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/personnel/:id
router.delete('/:id', async (req, res) => {
  try {
    await getConnection().execute('DELETE FROM personnel WHERE id = ?', [req.params.id]);
    res.json({ message: 'Personnel supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;