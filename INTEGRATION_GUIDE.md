# Guide d'Intégration Frontend-Backend EduManager

## Vue d'ensemble

Ce guide explique comment intégrer le frontend Next.js avec le backend Spring Boot pour créer une application complète de gestion scolaire.

## Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │   Backend       │
│   Next.js       │                 │   Spring Boot   │
│   Port: 3000    │                 │   Port: 8080    │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │   Base de       │
                                    │   données       │
                                    │   H2/MySQL      │
                                    └─────────────────┘
```

## Étapes d'intégration

### 1. Démarrage du Backend

#### Option A: Avec Maven (recommandé)
```bash
cd backend-spring
mvn spring-boot:run
```

#### Option B: Avec Gradle
```bash
cd backend-spring
./gradlew bootRun
```

#### Option C: Avec un IDE
- Ouvrir le projet dans IntelliJ IDEA ou Eclipse
- Exécuter la classe `EduManagerApplication`

Le backend sera accessible sur `http://localhost:8080/api`

### 2. Vérification du Backend

Vérifiez que le backend fonctionne en accédant à :
- **API Documentation**: `http://localhost:8080/api/swagger-ui.html`
- **Console H2**: `http://localhost:8080/api/h2-console`
- **Test API**: `http://localhost:8080/api/classes`

### 3. Configuration du Frontend

#### Intégration des services API

1. **Copier le fichier de configuration API** dans votre projet frontend :
```bash
cp api-config.js frontend/lib/api-config.js
```

2. **Modifier le composant principal** pour utiliser les vraies données :

```javascript
// Dans app/page.tsx, remplacer les données statiques par des appels API

import { useEffect, useState } from 'react'
import { classeService, eleveService, personnelService, paiementService } from '@/lib/api-config'

export default function SchoolManagement() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [personnel, setPersonnel] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [classesData, studentsData, personnelData] = await Promise.all([
        classeService.getAll(),
        eleveService.getAll(),
        personnelService.getAll()
      ])
      
      setClasses(classesData)
      setStudents(studentsData)
      setPersonnel(personnelData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      showNotification('error', 'Erreur', 'Impossible de charger les données')
    } finally {
      setLoading(false)
    }
  }

  // Remplacer les fonctions statiques par des appels API
  const ajouterClasse = async () => {
    if (newClasse.nom && newClasse.niveau && newClasse.section) {
      try {
        const nouvelleClasse = await classeService.create({
          nom: newClasse.nom,
          niveau: newClasse.niveau,
          section: newClasse.section,
          effectifMax: parseInt(newClasse.effectifMax) || 30,
          salle: newClasse.salle,
          description: newClasse.description
        })
        
        setClasses([...classes, nouvelleClasse])
        setNewClasse({ nom: "", niveau: "", section: "", effectifMax: "", salle: "", description: "" })
        showNotification("success", "Classe créée", `La classe ${nouvelleClasse.nom} a été créée avec succès.`)
      } catch (error) {
        console.error('Erreur lors de la création de la classe:', error)
        showNotification('error', 'Erreur', 'Impossible de créer la classe')
      }
    }
  }

  // ... autres fonctions similaires
}
```

### 4. Gestion des États de Chargement

Ajoutez des indicateurs de chargement :

```javascript
{loading ? (
  <div className="flex items-center justify-center min-h-screen">
    <div className="loading-spinner"></div>
    <span className="ml-2">Chargement des données...</span>
  </div>
) : (
  // Contenu principal
)}
```

### 5. Gestion des Erreurs

Implémentez une gestion d'erreurs robuste :

```javascript
const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  console.error('API Error:', error)
  const message = error.message || defaultMessage
  showNotification('error', 'Erreur', message)
}
```

### 6. Fonctions CRUD Complètes

#### Exemple pour les Classes

```javascript
// Créer une classe
const ajouterClasse = async () => {
  try {
    const nouvelleClasse = await classeService.create(newClasse)
    setClasses([...classes, nouvelleClasse])
    showNotification("success", "Classe créée", "Classe créée avec succès")
  } catch (error) {
    handleApiError(error, "Impossible de créer la classe")
  }
}

// Modifier une classe
const modifierClasse = async (id, classeData) => {
  try {
    const classeModifiee = await classeService.update(id, classeData)
    setClasses(classes.map(c => c.id === id ? classeModifiee : c))
    showNotification("success", "Classe modifiée", "Classe modifiée avec succès")
  } catch (error) {
    handleApiError(error, "Impossible de modifier la classe")
  }
}

// Supprimer une classe
const supprimerClasse = async (id) => {
  try {
    await classeService.delete(id)
    setClasses(classes.filter(c => c.id !== id))
    showNotification("success", "Classe supprimée", "Classe supprimée avec succès")
  } catch (error) {
    handleApiError(error, "Impossible de supprimer la classe")
  }
}
```

### 7. Synchronisation des Données

Implémentez une synchronisation automatique :

```javascript
// Rafraîchir les données toutes les 30 secondes
useEffect(() => {
  const interval = setInterval(() => {
    loadData()
  }, 30000)

  return () => clearInterval(interval)
}, [])
```

### 8. Configuration CORS

Le backend est déjà configuré pour accepter les requêtes du frontend (`http://localhost:3000`).

### 9. Variables d'Environnement

Créez un fichier `.env.local` dans le frontend :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

Puis utilisez-les dans la configuration :

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
```

## Fonctionnalités Avancées

### 1. Cache et Optimisation

```javascript
// Cache simple pour éviter les requêtes répétées
const cache = new Map()

const getCachedData = async (key, fetchFunction, ttl = 300000) => { // 5 minutes
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  
  const data = await fetchFunction()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

### 2. Pagination

```javascript
const [pagination, setPagination] = useState({
  page: 0,
  size: 10,
  total: 0
})

const loadStudentsPage = async (page = 0, size = 10) => {
  try {
    const response = await eleveService.getPage(page, size)
    setStudents(response.content)
    setPagination({
      page: response.number,
      size: response.size,
      total: response.totalElements
    })
  } catch (error) {
    handleApiError(error)
  }
}
```

### 3. Recherche en Temps Réel

```javascript
const [searchTerm, setSearchTerm] = useState('')
const [searchResults, setSearchResults] = useState([])

useEffect(() => {
  const delayedSearch = setTimeout(async () => {
    if (searchTerm.length > 2) {
      try {
        const results = await eleveService.search(searchTerm)
        setSearchResults(results)
      } catch (error) {
        console.error('Erreur de recherche:', error)
      }
    } else {
      setSearchResults([])
    }
  }, 300)

  return () => clearTimeout(delayedSearch)
}, [searchTerm])
```

## Tests d'Intégration

### 1. Test de Connectivité

```javascript
const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`)
    if (response.ok) {
      console.log('✅ Backend connecté')
      return true
    }
  } catch (error) {
    console.error('❌ Backend non accessible:', error)
    return false
  }
}
```

### 2. Test des Endpoints

```javascript
const testEndpoints = async () => {
  const tests = [
    { name: 'Classes', endpoint: '/classes' },
    { name: 'Élèves', endpoint: '/eleves' },
    { name: 'Personnel', endpoint: '/personnel' },
    { name: 'Paiements', endpoint: '/paiements' }
  ]

  for (const test of tests) {
    try {
      const response = await fetch(`${API_BASE_URL}${test.endpoint}`)
      console.log(`${test.name}: ${response.ok ? '✅' : '❌'}`)
    } catch (error) {
      console.log(`${test.name}: ❌ ${error.message}`)
    }
  }
}
```

## Déploiement

### 1. Développement
- Frontend: `npm run dev` (port 3000)
- Backend: `mvn spring-boot:run` (port 8080)

### 2. Production
- Frontend: Build et déploiement sur Vercel/Netlify
- Backend: Déploiement sur Heroku/AWS avec base MySQL

### 3. Variables d'Environnement Production

```env
# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Backend
SPRING_PROFILES_ACTIVE=prod
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

## Dépannage

### Problèmes Courants

1. **CORS Error**: Vérifiez la configuration CORS dans `SecurityConfig.java`
2. **Connection Refused**: Assurez-vous que le backend est démarré
3. **404 Not Found**: Vérifiez les URLs des endpoints
4. **500 Internal Error**: Consultez les logs du backend

### Logs et Debugging

```javascript
// Activer les logs détaillés
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('API Request:', endpoint, options)
  console.log('API Response:', response)
}
```

## Support

Pour toute question ou problème d'intégration :
1. Vérifiez les logs du backend et du frontend
2. Testez les endpoints avec Swagger UI
3. Consultez la documentation API
4. Créez une issue dans le repository du projet