using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Application.DTOs;

public class InvoicePaymentDto
{
    public Guid Id { get; set; }
    public string PaymentNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
