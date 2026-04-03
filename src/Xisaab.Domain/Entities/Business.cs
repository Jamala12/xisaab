using System;
using System.Collections.Generic;
using System.Text;
using Xisaab.Domain.Enums;

namespace Xisaab.Domain.Entities;

public class Business
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int BusinessNumber { get; set; }
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public BusinessTier Tier { get; set; }
}