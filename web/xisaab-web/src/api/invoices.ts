import client from './client'
import type { Invoice } from '../types'

export const getInvoices = async (): Promise<Invoice[]> => {
    const response = await client.get('/invoices')
    return response.data
}

export const getInvoice = async (id: string): Promise<Invoice> => {
    const response = await client.get(`/invoices/${id}`)
    return response.data
}

export const createInvoice = async (data: {
    customerId: string
    dueDate: string
    notes?: string
    lineItems: { description: string, quantity: number, unitPrice: number }[]
}): Promise<Invoice> => {
    const response = await client.post('/invoices', data)
    return response.data
}

export const updateInvoiceStatus = async (id: string, status: string): Promise<void> => {
    await client.patch(`/invoices/${id}/status`, { status })
}