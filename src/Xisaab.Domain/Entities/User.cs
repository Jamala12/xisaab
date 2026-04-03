using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid BusinessId { get; set; }
    public Business Business { get; set; } = null!;
}