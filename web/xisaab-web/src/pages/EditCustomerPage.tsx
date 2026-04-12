import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCustomer, updateCustomer } from '@/api/customers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function EditCustomerPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
    })

    useEffect(() => {
        getCustomer(id!)
            .then((customer) => {
                setForm({
                    name: customer.name,
                    phone: customer.phone || '',
                    email: customer.email || '',
                })
            })
            .finally(() => setLoading(false))
    }, [id])

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setError('Name is required.')
            return
        }
        setError(null)
        setSubmitting(true)
        try {
            await updateCustomer(id!, {
                name: form.name,
                phone: form.phone || undefined,
                email: form.email || undefined,
            })
            navigate(`/customers/${id}`)
        } catch (err: any) {
            setError(err.response?.data || 'Failed to update customer.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="text-muted-foreground">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/customers/${id}`}>
                        <ArrowLeft size={16} className="mr-1" />
                        Back
                    </Link>
                </Button>
            </div>

            <h1 className="text-2xl font-semibold text-foreground">
                Edit Customer
            </h1>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-2">
                    {error}
                </div>
            )}

            <Card className="shadow-sm max-w-lg">
                <CardHeader>
                    <CardTitle className="text-base">
                        Customer Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="Customer name"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            placeholder="Phone number"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            placeholder="Email address"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to={`/customers/${id}`}>Cancel</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
