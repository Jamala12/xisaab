using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Application.DTOs;

public class UpdateLineItemDto
{
    public string description { get; set; } = string.Empty;
    public decimal quantity { get; set; }
    public decimal unitPrice { get; set; }
}
