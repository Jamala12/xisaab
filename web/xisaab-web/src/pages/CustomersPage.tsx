import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCustomers } from '@/api/customers'
import type { Customer } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCustomers()
            .then(setCustomers)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-muted-foreground">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
                    <p className="text-muted-foreground text-sm mt-1">{customers.length} total customers</p>
                </div>
                <Button asChild>
                    <Link to="/customers/new">
                        <Plus size={16} className="mr-2" />
                        New Customer
                    </Link>
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0 px-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell className="text-muted-foreground font-mono text-sm">{customer.customerNumber}</TableCell>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                                    <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/customers/${customer.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}