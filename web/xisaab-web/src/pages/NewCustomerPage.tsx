import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCustomer } from '../api/customers'

export default function NewCustomerPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!name) { setError('Name is required'); return }
        setError('')
        setLoading(true)
        try {
            const customer = await createCustomer({ name, email, phone })
            navigate(`/customers/${customer.id}`)
        } catch {
            setError('Failed to create customer')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Link to="/customers">← Back to Customers</Link>
            <h1>New Customer</h1>
            {error && <p>{error}</p>}
            <div>
                <label>Name *</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Customer name"
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                />
            </div>
            <div>
                <label>Phone</label>
                <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone number"
                />
            </div>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Create Customer'}
            </button>
        </div>
    )
}