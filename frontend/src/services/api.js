import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pdf_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pdf_token')
      localStorage.removeItem('pdf_user')
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
}

// Conversion APIs
export const convertAPI = {
  convert: (formData, onProgress) =>
    API.post('/convert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress) {
          const pct = Math.round((e.loaded * 100) / e.total)
          onProgress(pct)
        }
      },
    }),
  pdfToImage: (formData, onProgress) =>
    API.post('/pdf-to-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress) {
          const pct = Math.round((e.loaded * 100) / e.total)
          onProgress(pct)
        }
      },
    }),
  download: (filename) =>
    API.get(`/download/${filename}`, { responseType: 'blob' }),
  getUserConversions: () => API.get('/user/conversions'),
}

export default API
