const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8082/api';

async function testNotesAPI() {
  console.log('🧪 Test des API Notes...\n');

  try {
    // Test 1: Vérifier la santé du serveur
    console.log('1. Test de santé du serveur...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Serveur:', healthData.message);

    // Test 2: Récupérer toutes les notes
    console.log('\n2. Récupération de toutes les notes...');
    const notesResponse = await fetch(`${API_BASE}/notes`);
    const notesData = await notesResponse.json();
    console.log(`✅ ${notesData.length} notes trouvées`);

    // Test 3: Ajouter une note de test
    console.log('\n3. Ajout d\'une note de test...');
    const newNote = {
      studentId: 1,
      matiere: 'Mathématiques',
      note: 15.5,
      coefficient: 3,
      trimestre: 'T1'
    };
    
    const addResponse = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    });
    
    if (addResponse.ok) {
      const addedNote = await addResponse.json();
      console.log('✅ Note ajoutée avec ID:', addedNote.id);
      
      // Test 4: Supprimer la note de test
      console.log('\n4. Suppression de la note de test...');
      const deleteResponse = await fetch(`${API_BASE}/notes/${addedNote.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Note supprimée avec succès');
      }
    }

    console.log('\n🎉 Tous les tests sont passés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

testNotesAPI();