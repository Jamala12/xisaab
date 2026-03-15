using Microsoft.AspNetCore.Mvc;
using Xisaab.Application.DTOs;
using Xisaab.Infrastructure.Services;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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
}
