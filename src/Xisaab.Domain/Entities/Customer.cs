using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Domain.Entities;

public class Customer
{
    public Guid Id { get; set; }
    public int CustomerNumber { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid BusinessId { get; set; }
    public Business Business { get; set; } = null!;
}
