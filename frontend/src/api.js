import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({ baseURL: BASE })

export const createBatch   = (data) => api.post('/api/batches', data)
export const getAllBatches = ()     => api.get('/api/batches')
export const getBatch      = (id)   => api.get(`/api/batches/${id}`)
