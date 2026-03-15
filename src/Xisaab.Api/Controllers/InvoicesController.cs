using Microsoft.AspNetCore.Mvc;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Infrastructure.Services;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly InvoiceService _invoiceService;

    public InvoicesController(InvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var invoices = await _invoiceService.GetAllAsync();
        return Ok(invoices);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceDto dto)
    {
        var invoice = await _invoiceService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = invoice.Id }, invoice);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var invoice = await _invoiceService.GetByIdAsync(id);
        if (invoice == null)
            return NotFound();
        return Ok(invoice);
    }
}