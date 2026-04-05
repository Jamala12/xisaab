import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getInvoices } from '@/api/invoices'
import type { Invoice } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Draft: 'secondary',
    Sent: 'default',
    Paid: 'outline',
    Overdue: 'destructive',
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getInvoices()
            .then(setInvoices)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-muted-foreground">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Invoices</h1>
                    <p className="text-muted-foreground text-sm mt-1">{invoices.length} total invoices</p>
                </div>
                <Button asChild>
                    <Link to="/invoices/new">
                        <Plus size={16} className="mr-2" />
                        New Invoice
                    </Link>
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0 px-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{invoice.invoiceNumber}</TableCell>
                                    <TableCell className="font-medium">{invoice.customerName}</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
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