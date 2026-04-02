using System;
using System.Collections.Generic;
using System.Text;

namespace Xisaab.Application.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
