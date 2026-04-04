import { useEffect, useState } from 'react'
import { getPayments } from '../api/payments'
import type { Payment } from '../types'

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPayments()
            .then(setPayments)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Payments</h1>

            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Method</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.paymentNumber}</td>
                            <td>{payment.invoiceNumber}</td>
                            <td>{payment.customerName}</td>
                            <td>${payment.amount.toFixed(2)}</td>
                            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                            <td>{payment.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}