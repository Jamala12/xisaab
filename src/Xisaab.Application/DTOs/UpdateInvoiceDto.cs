using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Application.DTOs;

public class UpdateInvoiceDto
{
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public string? Notes { get; set; } = string.Empty;
    public List<UpdateLineItemDto> Items { get; set; } = new List<UpdateLineItemDto>();
}