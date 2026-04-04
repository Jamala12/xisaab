import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCustomer } from '../api/customers'
import { getInvoices } from '../api/invoices'
import type { Customer, Invoice } from '../types'

export default function DetailedCustomerPage() {
    const { id } = useParams<{ id: string }>()
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getCustomer(id!),
            getInvoices()
        ]).then(([customerData, invoiceData]) => {
            setCustomer(customerData)
            setInvoices(invoiceData.filter(i => i.customerId === id))
        }).finally(() => setLoading(false))
    }, [id])

    if (loading) return <p>Loading...</p>
    if (!customer) return <p>Customer not found</p>

    return (
        <div>
            <Link to="/customers">← Back to Customers</Link>
            <h1>{customer.name}</h1>
            <p>{customer.customerNumber}</p>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>

            <h2>Invoices</h2>
            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Due Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.invoiceNumber}</td>
                            <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                            <td>${invoice.total.toFixed(2)}</td>
                            <td>{invoice.status}</td>
                            <td><Link to={`/invoices/${invoice.id}`}>View</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}