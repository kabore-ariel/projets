const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

// GET /api/students
router.get('/', async (req, res) => {
  try {
    const [rows] = await getConnection().execute('SELECT * FROM students ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/students
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, classeId, telephone, adresse, email, photo } = req.body;
    const [result] = await getConnection().execute(
      'INSERT INTO students (nom, prenom, dateNaissance, classeId, telephone, adresse, email, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, dateNaissance, classeId, telephone, adresse, email, photo]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  try {
    const { nom, prenom, dateNaissance, classeId, telephone, adresse, email, photo } = req.body;
    await getConnection().execute(
      'UPDATE students SET nom = ?, prenom = ?, dateNaissance = ?, classeId = ?, telephone = ?, adresse = ?, email = ?, photo = ? WHERE id = ?',
      [nom, prenom, dateNaissance, classeId, telephone, adresse, email, photo, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  try {
    await getConnection().execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Étudiant supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;