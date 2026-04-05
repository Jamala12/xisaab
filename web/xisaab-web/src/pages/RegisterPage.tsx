import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login: authLogin } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const response = await register(email, password, businessName)
            authLogin(response.token, response.email)
            navigate('/dashboard')
        } catch {
            setError('Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-foreground">Xisaab</h1>
                    <p className="text-muted-foreground text-sm mt-1">Create your account</p>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Register</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <div className="space-y-1.5">
                            <Label htmlFor="business">Business Name</Label>
                            <Input
                                id="business"
                                type="text"
                                placeholder="Your business name"
                                value={businessName}
                                onChange={e => setBusinessName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}