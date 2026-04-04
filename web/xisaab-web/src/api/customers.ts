import client from './client'
import type { Customer } from '../types'

export const getCustomers = async (): Promise<Customer[]> => {
    const response = await client.get('/customers')
    return response.data
}

export const getCustomer = async (id: string): Promise<Customer> => {
    const response = await client.get(`/customers/${id}`)
    return response.data
}

export const createCustomer = async (data: { name: string, phone?: string, email?: string }): Promise<Customer> => {
    const response = await client.post('/customers', data)
    return response.data
}