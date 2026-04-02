using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Application.DTOs;

public class DashboardDto
{
    public int TotalCustomers { get; set; }
    public int TotalInvoices { get; set; } // in last 30 days
    public int TotalDraftInvoices { get; set; }
    public int TotalSentInvoices { get; set; }
    public int TotalOverdueInvoices { get; set; }
    public decimal TotalAmountPaid { get; set; }
    public decimal TotalAmountOverdue { get; set; }
    public ICollection<InvoiceDto> RecentInvoices { get; set; } = new List<InvoiceDto>();
}
