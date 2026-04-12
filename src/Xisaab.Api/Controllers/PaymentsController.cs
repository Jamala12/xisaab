using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Infrastructure.Services;
using Xisaab.Domain.Enums;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly PaymentService _paymentService;
    public PaymentsController(PaymentService paymentService)
    {
        _paymentService = paymentService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var payments = await _paymentService.GetAllAsync();
        return Ok(payments);
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
    {
        var payment = await _paymentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = payment.Id }, payment);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var payment = await _paymentService.GetByIdAsync(id);
        if (payment == null)
            return NotFound();
        return Ok(payment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _paymentService.DeleteAsync(id);
        if (deleted == ServiceResult.NotFound)
            return NotFound();
        return NoContent();
    }
}
