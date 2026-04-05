import { useEffect, useState } from 'react'
import { getPayments } from '@/api/payments'
import type { Payment } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const methodVariant: Record<string, "default" | "secondary" | "outline"> = {
    Cash: 'secondary',
    BankTransfer: 'default',
    Cheque: 'outline',
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPayments()
            .then(setPayments)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-muted-foreground">Loading...</p>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
                <p className="text-muted-foreground text-sm mt-1">{payments.length} total payments</p>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0 px-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{payment.paymentNumber}</TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{payment.invoiceNumber}</TableCell>
                                    <TableCell className="font-medium">{payment.customerName}</TableCell>
                                    <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={methodVariant[payment.paymentMethod]}>
                                            {payment.paymentMethod}
                                        </Badge>
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