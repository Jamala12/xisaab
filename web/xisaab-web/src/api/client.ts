import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:5298/api'
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/auth/')
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default client