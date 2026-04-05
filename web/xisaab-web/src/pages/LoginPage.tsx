import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login: authLogin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = (location.state as any)?.from || '/dashboard'

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const response = await login(email, password)
            authLogin(response.token, response.email)
            navigate(from)
        } catch {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-foreground">Xisaab</h1>
                    <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Login</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="demo@xisaab.com"
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:underline">Register</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}