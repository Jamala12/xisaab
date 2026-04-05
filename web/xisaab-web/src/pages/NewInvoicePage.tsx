import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createInvoice } from '@/api/invoices'
import { getCustomers } from '@/api/customers'
import type { Customer } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface LineItem {
    description: string
    quantity: number
    unitPrice: number
}

export default function NewInvoicePage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [customerId, setCustomerId] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [notes, setNotes] = useState('')
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unitPrice: 0 }
    ])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getCustomers().then(setCustomers)
    }, [])

    const addLineItem = () => {
        setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }])
    }

    const removeLineItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index))
    }

    const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
        const updated = [...lineItems]
        updated[index] = { ...updated[index], [field]: value }
        setLineItems(updated)
    }

    const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    const handleSubmit = async () => {
        if (!customerId) { setError('Please select a customer'); return }
        if (!dueDate) { setError('Due date is required'); return }
        if (lineItems.some(i => !i.description)) { setError('All line items need a description'); return }
        setError('')
        setLoading(true)
        try {
            const invoice = await createInvoice({
                customerId,
                dueDate: new Date(dueDate).toISOString(),
                notes,
                lineItems
            })
            navigate(`/invoices/${invoice.id}`)
        } catch {
            setError('Failed to create invoice')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/invoices">
                        <ArrowLeft size={16} className="mr-1" />
                        Invoices
                    </Link>
                </Button>
            </div>

            <div>
                <h1 className="text-2xl font-semibold text-foreground">New Invoice</h1>
                <p className="text-muted-foreground text-sm mt-1">Create a new invoice for a customer</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Customer <span className="text-destructive">*</span></Label>
                        <Select value={customerId} onValueChange={setCustomerId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} ({c.customerNumber})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="dueDate">Due Date <span className="text-destructive">*</span></Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
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
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Line Items</CardTitle>
                    <Button variant="outline" size="sm" onClick={addLineItem}>
                        <Plus size={14} className="mr-1" />
                        Add Item
                    </Button>
                </CardHeader>
                <CardContent className="p-0 px-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-24 text-right">Qty</TableHead>
                                <TableHead className="w-32 text-right">Unit Price</TableHead>
                                <TableHead className="w-28 text-right">Total</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lineItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Input
                                            value={item.description}
                                            onChange={e => updateLineItem(index, 'description', e.target.value)}
                                            placeholder="Description"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={e => updateLineItem(index, 'quantity', Number(e.target.value))}
                                            min={1}
                                            className="text-right"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={e => updateLineItem(index, 'unitPrice', Number(e.target.value))}
                                            min={0}
                                            className="text-right"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${(item.quantity * item.unitPrice).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {lineItems.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeLineItem(index)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="font-medium">Total</TableCell>
                                <TableCell className="text-right font-semibold">${total.toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Invoice'}
                </Button>
            </div>
        </div>
    )
}