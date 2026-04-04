import client from './client'
import type { AuthResponse } from '../types'

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await client.post('/auth/login', { email, password })
    return response.data
}

export const register = async (email: string, password: string, businessName: string): Promise<AuthResponse> => {
    const response = await client.post('/auth/register', { email, password, businessName })
    return response.data
}