import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboard'
import type { DashboardData } from '../types'

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDashboard()
            .then(setData)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>
    if (!data) return <p>Failed to load dashboard</p>

    return (
        <div>
            <h1>Dashboard</h1>

            <div>
                <div>
                    <h3>Customers</h3>
                    <p>{data.totalCustomers}</p>
                </div>
                <div>
                    <h3>Invoices (30 days)</h3>
                    <p>{data.totalInvoices}</p>
                </div>
                <div>
                    <h3>Draft</h3>
                    <p>{data.totalDraftInvoices}</p>
                </div>
                <div>
                    <h3>Sent</h3>
                    <p>{data.totalSentInvoices}</p>
                </div>
                <div>
                    <h3>Overdue</h3>
                    <p>{data.totalOverdueInvoices}</p>
                </div>
                <div>
                    <h3>Amount Paid (30 days)</h3>
                    <p>${data.totalAmountPaid.toFixed(2)}</p>
                </div>
                <div>
                    <h3>Amount Overdue</h3>
                    <p>${data.totalAmountOverdue.toFixed(2)}</p>
                </div>
            </div>

            <h2>Recent Invoices</h2>
            <table>
                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Due Date</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.recentInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.invoiceNumber}</td>
                            <td>{invoice.customerName}</td>
                            <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                            <td>${invoice.total.toFixed(2)}</td>
                            <td>{invoice.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}