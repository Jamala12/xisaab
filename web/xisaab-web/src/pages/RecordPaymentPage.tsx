import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createPayment } from '@/api/payments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

export default function RecordPaymentPage() {
    const { id } = useParams<{ id: string }>()
    const [amount, setAmount] = useState('')
    const [paymentDate, setPaymentDate] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('Cash')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!amount) { setError('Amount is required'); return }
        if (!paymentDate) { setError('Date is required'); return }
        setError('')
        setLoading(true)
        try {
            await createPayment({
                invoiceId: id!,
                amount: Number(amount),
                paymentDate: new Date(paymentDate).toISOString(),
                paymentMethod,
                notes
            })
            navigate(`/invoices/${id}`)
        } catch {
            setError('Failed to record payment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-lg">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/invoices/${id}`}>
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Invoice
                    </Link>
                </Button>
            </div>

            <div>
                <h1 className="text-2xl font-semibold text-foreground">Record Payment</h1>
                <p className="text-muted-foreground text-sm mt-1">Record a payment against this invoice</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="space-y-1.5">
                        <Label htmlFor="amount">Amount <span className="text-destructive">*</span></Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                            min={0}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
                        <Input
                            id="date"
                            type="date"
                            value={paymentDate}
                            onChange={e => setPaymentDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="BankTransfer">Bank Transfer</SelectItem>
                                <SelectItem value="Cheque">Cheque</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Optional notes"
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? 'Recording...' : 'Record Payment'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}