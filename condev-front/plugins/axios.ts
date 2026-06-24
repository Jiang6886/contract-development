import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  })

  api.interceptors.request.use((request) => {
    if (process.client) {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`
      }
    }

    return request
  })

  return {
    provide: {
      api
    }
  }
})
