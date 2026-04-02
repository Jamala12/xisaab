using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Application.DTOs;
public class InvoiceDetailDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerNumber { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public ICollection<InvoiceLineItemDto> LineItems { get; set; } = new List<InvoiceLineItemDto>();
    public ICollection<InvoicePaymentDto> Payments { get; set; } = new List<InvoicePaymentDto>();
}
