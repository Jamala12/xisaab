using System;
using System.Collections.Generic;
using System.Text;
using Xisaab.Domain.Enums;

namespace Xisaab.Domain.Entities;

public class Invoice
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public int InvoiceNumber { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public InvoiceStatus Status { get; set; }
    public string? Notes { get; set; }
    public Guid BusinessId { get; set; }
    public Business Business { get; set; } = null!;

    public ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public decimal AmountPaid => Payments.Sum(p => p.Amount);
    public decimal AmountDue => LineItems.Sum(l => l.Quantity * l.UnitPrice) - AmountPaid;
    public bool IsFullyPaid => AmountDue <= 0;
}
