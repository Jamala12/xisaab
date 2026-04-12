using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xisaab.Application.DTOs;
using Xisaab.Infrastructure.Services;
using Xisaab.Domain.Enums;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _customerService;

    public CustomersController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customers = await _customerService.GetAllAsync();
        return Ok(customers);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
    {
        var customer = await _customerService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = customer.Id }, customer);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await _customerService.GetByIdAsync(id);
        if (customer == null)
            return NotFound();
        return Ok(customer);
    }

    [HttpGet("{id}/invoices")]
    public async Task<IActionResult> GetInvoices(Guid id)
    {
        var customer = await _customerService.GetByIdAsync(id);
        if (customer == null)
            return NotFound();
        var invoices = await _customerService.GetAllInvoicesForCustomerAsync(id);
        return Ok(invoices);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCustomerDto dto)
    {
        var updated = await _customerService.UpdateAsync(id, dto);
        if (updated == ServiceResult.NotFound)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _customerService.DeleteAsync(id);
        switch (deleted)
        {
            case ServiceResult.NotFound:
                return NotFound();
            case ServiceResult.Blocked:
                return BadRequest("Customer has recorded invoices and cannot be deleted.");
        }
        return NoContent();
    }
}
