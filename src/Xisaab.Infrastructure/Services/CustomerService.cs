using Microsoft.EntityFrameworkCore;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Infrastructure.Persistence;

namespace Xisaab.Infrastructure.Services;

public class CustomerService
{
    private readonly AppDbContext _db;

    public CustomerService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CustomerDto>> GetAllAsync()
    {
        return await _db.Customers
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                CustomerNumber = "CUS-" + c.CustomerNumber,
                Name = c.Name,
                Phone = c.Phone,
                Email = c.Email,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
    {
        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();

        return new CustomerDto
        {
            Id = customer.Id,
            CustomerNumber = "CUS-" + customer.CustomerNumber,
            Name = customer.Name,
            Phone = customer.Phone,
            Email = customer.Email,
            CreatedAt = customer.CreatedAt
        };
    }

    public async Task<CustomerDto?> GetByIdAsync(Guid id)
    {
        return await _db.Customers
            .Where(c => c.Id == id)
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                CustomerNumber = "CUS-" + c.CustomerNumber,
                Name = c.Name,
                Phone = c.Phone,
                Email = c.Email,
                CreatedAt = c.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<InvoiceDto>> GetAllInvoicesForCustomerAsync(Guid customerId)
    {
        return await _db.Invoices.Where(i => i.CustomerId == customerId)
                .Select(i => new InvoiceDto
                {
                    Id = i.Id,
                    InvoiceNumber = "INV-" + i.InvoiceNumber,
                    CustomerId = i.CustomerId,
                    CustomerName = i.Customer.Name,
                    CustomerNumber = "CUS-" + i.Customer.CustomerNumber,
                    IssueDate = i.IssueDate,
                    DueDate = i.DueDate,
                    Total = i.LineItems.Sum(LineItem => LineItem.Quantity * LineItem.UnitPrice),
                    Status = i.Status.ToString(),
                    Notes = i.Notes
                }).ToListAsync();
    }
}