const API_BASE_URL = 'http://localhost:8082/api'

// Vérification de la connexion au backend
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch (error) {
    console.error('Backend connection failed:', error)
    return false
  }
}

// Configuration des headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

// Fonction utilitaire pour les requêtes avec retry
const apiRequest = async (endpoint: string, options: RequestInit = {}, retries = 3) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: getHeaders(),
    timeout: 10000, // 10 secondes
    ...options,
  }

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error: any) {
      console.error(`API Error for ${endpoint} (attempt ${i + 1}):`, error)
      
      // Si c'est la dernière tentative ou une erreur non-réseau, on lance l'erreur
      if (i === retries - 1 || !isNetworkError(error)) {
        throw error
      }
      
      // Attendre avant de réessayer (backoff exponentiel)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}

// Fonction pour détecter les erreurs réseau
const isNetworkError = (error: any) => {
  return error.name === 'AbortError' || 
         error.code === 'ECONNRESET' ||
         error.code === 'ENOTFOUND' ||
         error.code === 'ECONNREFUSED' ||
         error.message.includes('fetch')
}

// Services API
export const classeService = {
  getAll: () => apiRequest('/classes'),
  create: (data: any) => apiRequest('/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/classes/${id}`, {
    method: 'DELETE',
  }),
}

export const eleveService = {
  getAll: () => apiRequest('/eleves'),
  create: (data: any) => apiRequest('/eleves', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/eleves/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/eleves/${id}`, {
    method: 'DELETE',
  }),
}

export const personnelService = {
  getAll: () => apiRequest('/personnel'),
  create: (data: any) => apiRequest('/personnel', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/personnel/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/personnel/${id}`, {
    method: 'DELETE',
  }),
}

export const noteService = {
  getAll: () => apiRequest('/notes'),
  create: (data: any) => apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  }),
}

export const paiementService = {
  getAll: () => apiRequest('/paiements'),
  create: (data: any) => apiRequest('/paiements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/paiements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/paiements/${id}`, {
    method: 'DELETE',
  }),
}

export const matiereService = {
  getAll: () => apiRequest('/matieres'),
  getByClasse: (classeId: number) => apiRequest(`/matieres/classe/${classeId}`),
  create: (data: any) => apiRequest('/matieres', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiRequest(`/matieres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiRequest(`/matieres/${id}`, {
    method: 'DELETE',
  }),
}

export const healthService = {
  check: () => apiRequest('/health'),
}