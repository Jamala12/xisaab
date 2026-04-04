import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createInvoice } from '../api/invoices'
import { getCustomers } from '../api/customers'
import type { Customer } from '../types'

interface LineItem {
    description: string
    quantity: number
    unitPrice: number
}

export default function NewInvoicePage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [customerId, setCustomerId] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [notes, setNotes] = useState('')
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unitPrice: 0 }
    ])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getCustomers().then(setCustomers)
    }, [])

    const addLineItem = () => {
        setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }])
    }

    const removeLineItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index))
    }

    const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
        const updated = [...lineItems]
        updated[index] = { ...updated[index], [field]: value }
        setLineItems(updated)
    }

    const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    const handleSubmit = async () => {
        if (!customerId) { setError('Please select a customer'); return }
        if (!dueDate) { setError('Due date is required'); return }
        if (lineItems.some(i => !i.description)) { setError('All line items need a description'); return }
        setError('')
        setLoading(true)
        try {
            const invoice = await createInvoice({
                customerId,
                dueDate: new Date(dueDate).toISOString(),
                notes,
                lineItems
            })
            navigate(`/invoices/${invoice.id}`)
        } catch {
            setError('Failed to create invoice')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Link to="/invoices">← Back to Invoices</Link>
            <h1>New Invoice</h1>
            {error && <p>{error}</p>}

            <div>
                <label>Customer *</label>
                <select value={customerId} onChange={e => setCustomerId(e.target.value)}>
                    <option value="">Select a customer</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.customerNumber})</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Due Date *</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                />
            </div>

            <div>
                <label>Notes</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Optional notes"
                />
            </div>

            <h2>Line Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {lineItems.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={e => updateLineItem(index, 'description', e.target.value)}
                                    placeholder="Description"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={e => updateLineItem(index, 'quantity', Number(e.target.value))}
                                    min={1}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={e => updateLineItem(index, 'unitPrice', Number(e.target.value))}
                                    min={0}
                                />
                            </td>
                            <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                            <td>
                                {lineItems.length > 1 &&
                                    <button onClick={() => removeLineItem(index)}>Remove</button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>Total</td>
                        <td>${total.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <button onClick={addLineItem}>Add Line Item</button>

            <div>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Invoice'}
                </button>
            </div>
        </div>
    )
}