import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [businessName, setBusiness] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login: authLogin } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try{
            const response = await register(email, password, businessName)
            authLogin(response.token, response.email)
            navigate('/dashboard')
        } catch {
            setError('Registration failed')
        } finally{
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Xisaab</h1>
            <h2>Register</h2>
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
            <div>
                <input
                    type="business"
                    placeholder="Business Name"
                    value={password}
                    onChange={e => setBusiness(e.target.value)}
                />
            </div>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}