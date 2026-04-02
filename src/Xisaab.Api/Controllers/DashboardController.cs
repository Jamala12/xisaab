using Microsoft.AspNetCore.Mvc;
using Xisaab.Infrastructure.Services;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class  DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var dashboardData = await _dashboardService.GetDashboardAsync();
        return Ok(dashboardData);
    }
}