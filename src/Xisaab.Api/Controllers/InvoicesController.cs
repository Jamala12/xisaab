using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Domain.Enums;
using Xisaab.Infrastructure.Services;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateInvoiceStatusDto dto)
    {
        var success = await _invoiceService.UpdateStatusAsync(id, dto.Status);
        if (success == ServiceResult.NotFound)
            return NotFound();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvoiceDto dto)
    {
        var update = await _invoiceService.UpdateInvoiceAsync(id, dto);
        switch (update)
        {
            case ServiceResult.NotFound:
                return NotFound();
            case ServiceResult.Blocked:
                return BadRequest("Invoice has recorded payments and cannot be edited.");
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _invoiceService.DeleteAsync(id);
        switch (deleted)
        {
            case ServiceResult.NotFound:
                return NotFound();
            case ServiceResult.Blocked:
                return BadRequest("Invoice has recorded payments and cannot be deleted.");
        }
        return NoContent();
    }
}