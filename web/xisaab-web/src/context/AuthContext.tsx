import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextType {
    token: string | null
    email: string | null
    login: (token: string, email: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))

    const login = (token: string, email: string) => {
        localStorage.setItem('token', token)
        localStorage.setItem('email', email)
        setToken(token)
        setEmail(email)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        setToken(null)
        setEmail(null)
    }

    return (
        <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}