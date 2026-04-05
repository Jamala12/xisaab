import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCustomer } from '@/api/customers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

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
        <div className="space-y-6 max-w-lg">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/customers">
                        <ArrowLeft size={16} className="mr-1" />
                        Customers
                    </Link>
                </Button>
            </div>

            <div>
                <h1 className="text-2xl font-semibold text-foreground">New Customer</h1>
                <p className="text-muted-foreground text-sm mt-1">Add a new customer to your account</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Customer name"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="063-0000000"
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? 'Creating...' : 'Create Customer'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}