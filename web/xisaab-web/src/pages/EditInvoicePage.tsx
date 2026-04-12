import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getInvoice, updateInvoice } from '@/api/invoices'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface LineItemForm {
    description: string
    quantity: number
    unitPrice: number
}

export default function EditInvoicePage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({
        issueDate: '',
        dueDate: '',
        notes: '',
    })
    const [lineItems, setLineItems] = useState<LineItemForm[]>([])

    useEffect(() => {
        getInvoice(id!)
            .then((invoice) => {
                setForm({
                    issueDate: invoice.issueDate.split('T')[0],
                    dueDate: invoice.dueDate.split('T')[0],
                    notes: invoice.notes || '',
                })
                setLineItems(
                    invoice.lineItems?.map((item) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })) ?? [],
                )
            })
            .finally(() => setLoading(false))
    }, [id])

    const addLineItem = () => {
        setLineItems([
            ...lineItems,
            { description: '', quantity: 1, unitPrice: 0 },
        ])
    }

    const removeLineItem = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index))
    }

    const updateLineItem = (
        index: number,
        field: keyof LineItemForm,
        value: string | number,
    ) => {
        setLineItems(
            lineItems.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
            ),
        )
    }

    const lineItemTotal = (item: LineItemForm) => item.quantity * item.unitPrice

    const invoiceTotal = lineItems.reduce(
        (sum, item) => sum + lineItemTotal(item),
        0,
    )

    const handleSubmit = async () => {
        if (lineItems.length === 0) {
            setError('At least one line item is required.')
            return
        }
        if (lineItems.some((i) => !i.description.trim())) {
            setError('All line items must have a description.')
            return
        }
        setError(null)
        setSubmitting(true)
        try {
            await updateInvoice(id!, {
                issueDate: form.issueDate,
                dueDate: form.dueDate,
                notes: form.notes || undefined,
                items: lineItems,
            })
            navigate(`/invoices/${id}`)
        } catch (err: any) {
            setError(err.response?.data || 'Failed to update invoice.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="text-muted-foreground">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link to={`/invoices/${id}`}>
                        <ArrowLeft size={16} className="mr-1" />
                        Back
                    </Link>
                </Button>
            </div>

            <h1 className="text-2xl font-semibold text-foreground">
                Edit Invoice
            </h1>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md px-4 py-2">
                    {error}
                </div>
            )}

            <div className="space-y-4 max-w-2xl">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="issueDate">Issue Date</Label>
                                <Input
                                    id="issueDate"
                                    type="date"
                                    value={form.issueDate}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            issueDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={form.dueDate}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            dueDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={form.notes}
                                onChange={(e) =>
                                    setForm({ ...form, notes: e.target.value })
                                }
                                placeholder="Optional notes"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Line Items</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addLineItem}
                        >
                            <Plus size={14} className="mr-1" />
                            Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {lineItems.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-2 items-end"
                            >
                                <div className="col-span-5 space-y-1">
                                    {index === 0 && <Label>Description</Label>}
                                    <Input
                                        value={item.description}
                                        onChange={(e) =>
                                            updateLineItem(
                                                index,
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Description"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    {index === 0 && <Label>Qty</Label>}
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateLineItem(
                                                index,
                                                'quantity',
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    {index === 0 && <Label>Unit Price</Label>}
                                    <Input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={item.unitPrice}
                                        onChange={(e) =>
                                            updateLineItem(
                                                index,
                                                'unitPrice',
                                                parseFloat(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    {index === 0 && <Label>Total</Label>}
                                    <p className="text-sm font-medium py-2 text-right">
                                        ${lineItemTotal(item).toFixed(2)}
                                    </p>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeLineItem(index)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {lineItems.length > 0 && (
                            <div className="flex justify-end pt-2 border-t text-sm font-semibold">
                                Total: ${invoiceTotal.toFixed(2)}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-2">
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to={`/invoices/${id}`}>Cancel</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
