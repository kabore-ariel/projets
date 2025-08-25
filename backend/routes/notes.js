const express = require('express');
const { getConnection } = require('../database');
const router = express.Router();

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const [rows] = await getConnection().execute(`
      SELECT n.*, s.nom, s.prenom 
      FROM notes n 
      JOIN students s ON n.studentId = s.id 
      ORDER BY n.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/student/:studentId
router.get('/student/:studentId', async (req, res) => {
  try {
    const [rows] = await getConnection().execute(
      'SELECT * FROM notes WHERE studentId = ? ORDER BY created_at DESC',
      [req.params.studentId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notes
router.post('/', async (req, res) => {
  try {
    const { studentId, matiere, note, coefficient, trimestre } = req.body;
    const [result] = await getConnection().execute(
      'INSERT INTO notes (studentId, matiere, note, coefficient, trimestre) VALUES (?, ?, ?, ?, ?)',
      [studentId, matiere, note, coefficient, trimestre]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const { studentId, matiere, note, coefficient, trimestre } = req.body;
    await getConnection().execute(
      'UPDATE notes SET studentId = ?, matiere = ?, note = ?, coefficient = ?, trimestre = ? WHERE id = ?',
      [studentId, matiere, note, coefficient, trimestre, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    await getConnection().execute('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Note supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notes/student/:studentId - Supprimer toutes les notes d'un étudiant
router.delete('/student/:studentId', async (req, res) => {
  try {
    const { trimestre } = req.query;
    let query = 'DELETE FROM notes WHERE studentId = ?';
    let params = [req.params.studentId];
    
    if (trimestre) {
      query += ' AND trimestre = ?';
      params.push(trimestre);
    }
    
    const [result] = await getConnection().execute(query, params);
    res.json({ 
      message: `${result.affectedRows} note(s) supprimée(s)`,
      deletedCount: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;