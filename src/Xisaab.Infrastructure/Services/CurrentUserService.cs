using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Xisaab.Infrastructure.Services;

public class CurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid BusinessId
    {
        get
        {
            var claim = _httpContextAccessor.HttpContext?.User?.FindFirst("BusinessId");
            if (claim == null) throw new Exception("BusinessId claim not found");
            return Guid.Parse(claim.Value);
        }
    }
}
