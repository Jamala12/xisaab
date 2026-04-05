import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getInvoice, updateInvoiceStatus } from '@/api/invoices'
import type { Invoice } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    Draft: 'secondary',
    Sent: 'default',
    Paid: 'outline',
    Overdue: 'destructive',
}

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState(false)

    useEffect(() => {
        getInvoice(id!)
            .then(setInvoice)
            .finally(() => setLoading(false))
    }, [id])

    const handleStatusChange = async (status: string) => {
        setStatusLoading(true)
        try {
            await updateInvoiceStatus(id!, status)
            setInvoice(prev => prev ? { ...prev, status } : prev)
        } finally {
            setStatusLoading(false)
        }
    }

    if (loading) return <p className="text-muted-foreground">Loading...</p>
    if (!invoice) return <p className="text-destructive">Invoice not found</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/invoices">
                        <ArrowLeft size={16} className="mr-1" />
                        Invoices
                    </Link>
                </Button>
            </div>

            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-foreground">{invoice.invoiceNumber}</h1>
                        <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        <Link to={`/customers/${invoice.customerId}`} className="hover:underline">
                            {invoice.customerName} · {invoice.customerNumber}
                        </Link>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={invoice.status}
                        onValueChange={handleStatusChange}
                        disabled={statusLoading}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Sent">Sent</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button asChild>
                        <Link to={`/invoices/${id}/payment`}>Record Payment</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Issue Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">${invoice.total.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            {invoice.notes && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{invoice.notes}</p>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Line Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.lineItems?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">${item.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-medium">${item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="font-medium">Total</TableCell>
                                <TableCell className="text-right font-semibold">${invoice.total.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Payments</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.payments?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No payments recorded
                                    </TableCell>
                                </TableRow>
                            ) : invoice.payments?.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{payment.paymentNumber}</TableCell>
                                    <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{payment.paymentMethod}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}