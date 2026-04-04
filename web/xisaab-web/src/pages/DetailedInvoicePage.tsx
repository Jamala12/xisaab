import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getInvoice, updateInvoiceStatus } from '../api/invoices'
import type { Invoice } from '../types'

export default function DetailedInvoicePage() {
    const { id } = useParams<{ id: string }>()
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState(false)

    useEffect(() => {
        getInvoice(id!)
            .then(setInvoice)
            .finally(() => setLoading(false))
    }, [id])

    const handleStatusChange = async (status: string) => {
        setStatusLoading(true)
        try {
            await updateInvoiceStatus(id!, status)
            setInvoice(prev => prev ? { ...prev, status } : prev)
        } finally {
            setStatusLoading(false)
        }
    }

    if (loading) return <p>Loading...</p>
    if (!invoice) return <p>Invoice not found</p>

    return (
        <div>
            <Link to="/invoices">← Back to Invoices</Link>
            <div>
                <h1>{invoice.invoiceNumber}</h1>
                <span>{invoice.status}</span>
            </div>

            <p>Customer: <Link to={`/customers/${invoice.customerId}`}>{invoice.customerName} ({invoice.customerNumber})</Link></p>
            <p>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p>Notes: {invoice.notes}</p>

            <div>
                <label>Update Status: </label>
                <select
                    value={invoice.status}
                    onChange={e => handleStatusChange(e.target.value)}
                    disabled={statusLoading}
                >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                </select>
            </div>

            <h2>Line Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.lineItems?.map(item => (
                        <tr key={item.id}>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>${item.unitPrice.toFixed(2)}</td>
                            <td>${item.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>Total</td>
                        <td>${invoice.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <h2>Payments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Method</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.payments?.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.paymentNumber}</td>
                            <td>${payment.amount.toFixed(2)}</td>
                            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                            <td>{payment.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Link to={`/invoices/${id}/payment`}>Record Payment</Link>
        </div>
    )
}