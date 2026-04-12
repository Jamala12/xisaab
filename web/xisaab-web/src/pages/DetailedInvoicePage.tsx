import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { deleteInvoice, getInvoice, updateInvoiceStatus } from '@/api/invoices'
import { deletePayment } from '@/api/payments'
import type { Invoice } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft } from 'lucide-react'

const statusVariant: Record<
    string,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
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
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [warning, setWarning] = useState<string | null>(null)

    useEffect(() => {
        getInvoice(id!)
            .then(setInvoice)
            .finally(() => setLoading(false))
    }, [id])

    const handleStatusChange = async (status: string) => {
        setStatusLoading(true)
        try {
            await updateInvoiceStatus(id!, status)
            setInvoice((prev) => (prev ? { ...prev, status } : prev))
        } finally {
            setStatusLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        setLoading(true)
        try {
            await deleteInvoice(id)
            navigate('/invoices')
        } catch (err: any) {
            setError(err.response?.data || 'Failed to delete invoice.')
        } finally {
            setLoading(false)
        }
    }

    const handlePaymentDelete = async (paymentId: string) => {
        setLoading(true)
        try {
            await deletePayment(paymentId)
            setInvoice((prev) =>
                prev
                    ? {
                          ...prev,
                          payments: prev.payments?.filter(
                              (p) => p.id !== paymentId,
                          ),
                      }
                    : prev,
            )
        } catch (err: any) {
            setError(err.response?.data || 'Failed to delete payment.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p className="text-muted-foreground">Loading...</p>
    if (!invoice) return <p className="text-destructive">Invoice not found</p>

    const hasPayments = !!invoice.payments && invoice.payments.length > 0

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
                        <h1 className="text-2xl font-semibold text-foreground">
                            {invoice.invoiceNumber}
                        </h1>
                        <Badge variant={statusVariant[invoice.status]}>
                            {invoice.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                        <Link
                            to={`/customers/${invoice.customerId}`}
                            className="hover:underline"
                        >
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
                        <Link to={`/invoices/${id}/payment`}>
                            Record Payment
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        asChild={!hasPayments}
                        onClick={
                            hasPayments
                                ? () =>
                                      setWarning(
                                          'Invoice has recorded payments and cannot be edited.',
                                      )
                                : undefined
                        }
                        className={hasPayments ? 'opacity-50' : ''}
                        style={hasPayments ? { cursor: 'not-allowed' } : {}}
                    >
                        {!hasPayments ? (
                            <Link to={`/invoices/${invoice.id}/edit`}>
                                Edit
                            </Link>
                        ) : (
                            'Edit'
                        )}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={loading}>
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete {invoice.invoiceNumber}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this invoice
                                    and all its line items. This cannot be
                                    undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {warning && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md px-4 py-2">
                    {warning}
                </div>
            )}
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-2">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Issue Date
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Due Date
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">
                            ${invoice.total.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {invoice.notes && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{invoice.notes}</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Line Items</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 px-2">
                        <Table className="table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">
                                        Qty
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Unit Price
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.lineItems?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.description}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            ${item.unitPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${item.total.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="font-medium"
                                    >
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${invoice.total.toFixed(2)}
                                    </TableCell>
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
                        <Table className="table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Number</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.payments?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground py-8"
                                        >
                                            No payments recorded
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoice.payments?.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                {payment.paymentNumber}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${payment.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    payment.paymentDate,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {payment.paymentMethod}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete{' '}
                                                                {
                                                                    payment.paymentNumber
                                                                }
                                                                ?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will
                                                                permanently
                                                                delete this
                                                                payment. The
                                                                invoice status
                                                                will be
                                                                reverted. This
                                                                cannot be
                                                                undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handlePaymentDelete(
                                                                        payment.id,
                                                                    )
                                                                }
                                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
