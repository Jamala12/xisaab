import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getInvoices } from '../api/invoices'
import type { Invoice } from '../types'

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getInvoices()
            .then(setInvoices)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <div>
                <h1>Invoices</h1>
                <Link to="/invoices/new">New Invoice</Link>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Customer</th>
                        <th>Issue Date</th>
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
                            <td>{invoice.customerName}</td>
                            <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>
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