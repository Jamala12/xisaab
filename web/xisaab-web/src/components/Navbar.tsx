import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { email, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav>
            <div>
                <Link to="/dashboard">Xisaab</Link>
            </div>
            <div>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/customers">Customers</Link>
                <Link to="/invoices">Invoices</Link>
                <Link to="/payments">Payments</Link>
            </div>
            <div>
                <span>{email}</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    )
}