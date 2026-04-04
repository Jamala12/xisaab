import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login: authLogin } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const response = await login(email, password)
            authLogin(response.token, response.email)
            navigate('/dashboard')
        } catch {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Xisaab</h1>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    )
}