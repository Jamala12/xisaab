import client from './client'
import type { Payment } from '../types'

export const getPayments = async (): Promise<Payment[]> => {
    const response = await client.get('/payments')
    return response.data
}

export const createPayment = async (data: {
    invoiceId: string
    amount: number
    paymentDate: string
    paymentMethod: string
    notes?: string
}): Promise<Payment> => {
    const response = await client.post('/payments', data)
    return response.data
}