// Configuration API pour EduManager
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  ENDPOINTS: {
    // Classes
    CLASSES: '/classes',
    CLASSES_BY_ID: (id) => `/classes/${id}`,
    CLASSES_BY_NIVEAU: (niveau) => `/classes/niveau/${niveau}`,
    CLASSES_DISPONIBLES: '/classes/disponibles',
    ASSIGNER_ENSEIGNANT_PRINCIPAL: (classeId, enseignantId) => `/classes/${classeId}/enseignant-principal/${enseignantId}`,
    ASSIGNER_ENSEIGNANT: (classeId, enseignantId) => `/classes/${classeId}/enseignants/${enseignantId}`,
    
    // Élèves
    ELEVES: '/eleves',
    ELEVES_BY_ID: (id) => `/eleves/${id}`,
    ELEVES_BY_CLASSE: (classeId) => `/eleves/classe/${classeId}`,
    ELEVES_SEARCH: (term) => `/eleves/search?q=${term}`,
    
    // Personnel
    PERSONNEL: '/personnel',
    PERSONNEL_BY_ID: (id) => `/personnel/${id}`,
    ENSEIGNANTS: '/personnel/enseignants',
    PERSONNEL_BY_MATIERE: (matiere) => `/personnel/matiere/${matiere}`,
    
    // Notes
    NOTES: '/notes',
    NOTES_BY_ID: (id) => `/notes/${id}`,
    NOTES_BY_ELEVE: (eleveId) => `/notes/eleve/${eleveId}`,
    NOTES_BY_CLASSE: (classeId) => `/notes/classe/${classeId}`,
    MOYENNES_ELEVE: (eleveId) => `/notes/eleve/${eleveId}/moyennes`,
    
    // Paiements
    PAIEMENTS: '/paiements',
    PAIEMENTS_BY_ID: (id) => `/paiements/${id}`,
    PAIEMENTS_BY_ELEVE: (eleveId) => `/paiements/eleve/${eleveId}`,
    PAIEMENTS_BY_CLASSE: (classeId) => `/paiements/classe/${classeId}`,
    MARQUER_PAYE: (id) => `/paiements/${id}/marquer-paye`,
    STATISTIQUES_PAIEMENTS: '/paiements/statistiques'
  }
};

// Service API pour les requêtes HTTP
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Si la réponse est vide (204 No Content), retourner null
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Méthodes HTTP
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Services spécialisés
class ClasseService extends ApiService {
  async getAll() {
    return this.get(API_CONFIG.ENDPOINTS.CLASSES);
  }

  async getById(id) {
    return this.get(API_CONFIG.ENDPOINTS.CLASSES_BY_ID(id));
  }

  async getByNiveau(niveau) {
    return this.get(API_CONFIG.ENDPOINTS.CLASSES_BY_NIVEAU(niveau));
  }

  async getDisponibles() {
    return this.get(API_CONFIG.ENDPOINTS.CLASSES_DISPONIBLES);
  }

  async create(classeData) {
    return this.post(API_CONFIG.ENDPOINTS.CLASSES, classeData);
  }

  async update(id, classeData) {
    return this.put(API_CONFIG.ENDPOINTS.CLASSES_BY_ID(id), classeData);
  }

  async delete(id) {
    return this.delete(API_CONFIG.ENDPOINTS.CLASSES_BY_ID(id));
  }

  async assignerEnseignantPrincipal(classeId, enseignantId) {
    return this.put(API_CONFIG.ENDPOINTS.ASSIGNER_ENSEIGNANT_PRINCIPAL(classeId, enseignantId));
  }

  async assignerEnseignant(classeId, enseignantId) {
    return this.put(API_CONFIG.ENDPOINTS.ASSIGNER_ENSEIGNANT(classeId, enseignantId));
  }
}

class EleveService extends ApiService {
  async getAll() {
    return this.get(API_CONFIG.ENDPOINTS.ELEVES);
  }

  async getById(id) {
    return this.get(API_CONFIG.ENDPOINTS.ELEVES_BY_ID(id));
  }

  async getByClasse(classeId) {
    return this.get(API_CONFIG.ENDPOINTS.ELEVES_BY_CLASSE(classeId));
  }

  async search(term) {
    return this.get(API_CONFIG.ENDPOINTS.ELEVES_SEARCH(term));
  }

  async create(eleveData) {
    return this.post(API_CONFIG.ENDPOINTS.ELEVES, eleveData);
  }

  async update(id, eleveData) {
    return this.put(API_CONFIG.ENDPOINTS.ELEVES_BY_ID(id), eleveData);
  }

  async delete(id) {
    return this.delete(API_CONFIG.ENDPOINTS.ELEVES_BY_ID(id));
  }
}

class PersonnelService extends ApiService {
  async getAll() {
    return this.get(API_CONFIG.ENDPOINTS.PERSONNEL);
  }

  async getById(id) {
    return this.get(API_CONFIG.ENDPOINTS.PERSONNEL_BY_ID(id));
  }

  async getEnseignants() {
    return this.get(API_CONFIG.ENDPOINTS.ENSEIGNANTS);
  }

  async create(personnelData) {
    return this.post(API_CONFIG.ENDPOINTS.PERSONNEL, personnelData);
  }

  async update(id, personnelData) {
    return this.put(API_CONFIG.ENDPOINTS.PERSONNEL_BY_ID(id), personnelData);
  }

  async delete(id) {
    return this.delete(API_CONFIG.ENDPOINTS.PERSONNEL_BY_ID(id));
  }
}

class PaiementService extends ApiService {
  async getAll() {
    return this.get(API_CONFIG.ENDPOINTS.PAIEMENTS);
  }

  async getByEleve(eleveId) {
    return this.get(API_CONFIG.ENDPOINTS.PAIEMENTS_BY_ELEVE(eleveId));
  }

  async getByClasse(classeId) {
    return this.get(API_CONFIG.ENDPOINTS.PAIEMENTS_BY_CLASSE(classeId));
  }

  async marquerPaye(id, modePaiement, reference) {
    return this.put(API_CONFIG.ENDPOINTS.MARQUER_PAYE(id), {
      modePaiement,
      referenceTransaction: reference
    });
  }

  async getStatistiques() {
    return this.get(API_CONFIG.ENDPOINTS.STATISTIQUES_PAIEMENTS);
  }
}

// Instances des services
const classeService = new ClasseService();
const eleveService = new EleveService();
const personnelService = new PersonnelService();
const paiementService = new PaiementService();

// Export pour utilisation dans le frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_CONFIG,
    ApiService,
    ClasseService,
    EleveService,
    PersonnelService,
    PaiementService,
    classeService,
    eleveService,
    personnelService,
    paiementService
  };
}

// Export pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
  window.EduManagerAPI = {
    API_CONFIG,
    classeService,
    eleveService,
    personnelService,
    paiementService
  };
}