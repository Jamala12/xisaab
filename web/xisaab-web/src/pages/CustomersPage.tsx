import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCustomers } from '../api/customers'
import type { Customer } from '../types'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCustomers()
            .then(setCustomers)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <div>
                <h1>Customers</h1>
                <Link to="/customers/new">New Customer</Link>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.customerNumber}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>
                                <Link to={`/customers/${customer.id}`}>View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}