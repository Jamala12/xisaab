export interface InvoiceLineItem {
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
}

export interface InvoicePayment {
    id: string
    paymentNumber: string
    amount: number
    paymentDate: string
    paymentMethod: string
    notes?: string
}

export interface Customer {
    id: string
    customerNumber: string
    name: string
    phone?: string
    email?: string
    createdAt: string
}

export interface Invoice {
    id: string
    customerId: string
    invoiceNumber: string
    customerName: string
    customerNumber: string
    issueDate: string
    dueDate: string
    total: number
    status: string
    notes?: string
    lineItems?: InvoiceLineItem[]
    payments?: InvoicePayment[]
}

export interface Payment {
    id: string
    invoiceId: string
    paymentNumber: string
    invoiceNumber: string
    customerName: string
    customerNumber: string
    amount: number
    paymentDate: string
    paymentMethod: string
    notes?: string
}

export interface AuthResponse {
    token: string
    email: string
}

export interface DashboardData {
    totalCustomers: number
    totalInvoices: number
    totalDraftInvoices: number
    totalSentInvoices: number
    totalOverdueInvoices: number
    totalAmountPaid: number
    totalAmountOverdue: number
    recentInvoices: Invoice[]
}