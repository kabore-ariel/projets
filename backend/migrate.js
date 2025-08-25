const { connectDB } = require('./database');

const runMigrations = async () => {
  try {
    console.log('🚀 Démarrage des migrations...');
    await connectDB();
    console.log('✅ Migrations terminées avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  }
};

runMigrations();