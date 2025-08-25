const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');
const app = express();
const PORT = 8082;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/classes', require('./routes/classes'));
app.use('/api/students', require('./routes/students'));
app.use('/api/eleves', require('./routes/eleves'));
app.use('/api/personnel', require('./routes/personnel'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/paiements', require('./routes/paiements'));
app.use('/api/matieres', require('./routes/matieres'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const connection = require('./database').getConnection();
    await connection.execute('SELECT 1');
    res.json({ status: 'OK', message: 'Backend MySQL is running' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
};

startServer();