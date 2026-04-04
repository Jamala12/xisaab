import client from './client'
import type { DashboardData } from '../types'

export const getDashboard = async (): Promise<DashboardData> => {
    const response = await client.get('/dashboard')
    return response.data
}