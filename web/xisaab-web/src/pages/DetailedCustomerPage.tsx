import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCustomer } from '@/api/customers'
import { getInvoices } from '@/api/invoices'
import type { Customer, Invoice } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, Phone } from 'lucide-react'

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Draft: 'secondary',
    Sent: 'default',
    Paid: 'outline',
    Overdue: 'destructive',
}

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getCustomer(id!),
            getInvoices()
        ]).then(([customerData, invoiceData]) => {
            setCustomer(customerData)
            setInvoices(invoiceData.filter(i => i.customerId === id))
        }).finally(() => setLoading(false))
    }, [id])

    if (loading) return <p className="text-muted-foreground">Loading...</p>
    if (!customer) return <p className="text-destructive">Customer not found</p>

    const totalOwed = invoices
        .filter(i => i.status !== 'Paid')
        .reduce((sum, i) => sum + i.total, 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/customers">
                        <ArrowLeft size={16} className="mr-1" />
                        Customers
                    </Link>
                </Button>
            </div>

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">{customer.name}</h1>
                    <p className="text-muted-foreground text-sm font-mono mt-1">{customer.customerNumber}</p>
                </div>
                <Button asChild>
                    <Link to={`/invoices/new?customerId=${customer.id}`}>New Invoice</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Email</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <Mail size={14} className="text-muted-foreground" />
                        <span className="text-sm">{customer.email || '—'}</span>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Phone</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <Phone size={14} className="text-muted-foreground" />
                        <span className="text-sm">{customer.phone || '—'}</span>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className={`text-lg font-semibold ${totalOwed > 0 ? 'text-destructive' : 'text-foreground'}`}>
                            ${totalOwed.toFixed(2)}
                        </span>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Invoices</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No invoices yet
                                    </TableCell>
                                </TableRow>
                            ) : invoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{invoice.invoiceNumber}</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[invoice.status]}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/invoices/${invoice.id}`}>View</Link>
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