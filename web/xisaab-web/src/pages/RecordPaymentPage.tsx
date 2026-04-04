import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createPayment } from '../api/payments'

export default function RecordPaymentPage() {
    const { id } = useParams<{ id: string }>()
    const [amount, setAmount] = useState('')
    const [paymentDate, setPaymentDate] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!amount) { setError('Amount is required'); return }
        if (!paymentDate) { setError('Date is required'); return }
        setError('')
        setLoading(true)
        try {
            await createPayment({
                invoiceId: id!,
                amount: Number(amount),
                paymentDate: new Date(paymentDate).toISOString(),
                paymentMethod,
                notes
            })
            navigate(`/invoices/${id}`)
        } catch {
            setError('Failed to record payment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Link to={`/invoices/${id}`}>← Back to Invoice</Link>
            <h1>Record Payment</h1>
            {error && <p>{error}</p>}

            <div>
                <label>Amount *</label>
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    min={0}
                />
            </div>

            <div>
                <label>Date *</label>
                <input
                    type="date"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                />
            </div>

            <div>
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="Cash">Cash</option>
                    <option value="BankTransfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                </select>
            </div>

            <div>
                <label>Notes</label>
                <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Optional notes"
                />
            </div>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Recording...' : 'Record Payment'}
            </button>
        </div>
    )
}