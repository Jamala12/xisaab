using System;
using System.Collections.Generic;
using System.Text;
using Xisaab.Domain.Enums;

namespace Xisaab.Domain.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public Guid InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;
    public int PaymentNumber { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaidAt { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public Guid BusinessId { get; set; }
    public Business Business { get; set; } = null!;
}
