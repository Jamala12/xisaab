using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Text;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Domain.Enums;
using Xisaab.Infrastructure.Persistence;

namespace Xisaab.Infrastructure.Services;

public class InvoiceService
{
    private readonly AppDbContext _db;

    public InvoiceService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<InvoiceDto>> GetAllAsync()
    {
        return await _db.Invoices.Select(i => new InvoiceDto
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

    public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto)
    {
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            CustomerId = dto.CustomerId,
            IssueDate = DateTime.UtcNow,
            DueDate = dto.DueDate,
            Notes = dto.Notes,
            Status = InvoiceStatus.Draft,
        };
    
        foreach (var item in dto.LineItems)
        {
            invoice.LineItems.Add(new InvoiceLineItem
            {
                Id = Guid.NewGuid(),
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            });
        }
    
        _db.Invoices.Add(invoice);
        await _db.SaveChangesAsync();

        var customer = await _db.Customers.FindAsync(invoice.CustomerId);

        return new InvoiceDto
        {
            Id = invoice.Id,
            InvoiceNumber = "INV-" + invoice.InvoiceNumber,
            CustomerId = invoice.CustomerId,
            CustomerName = invoice.Customer.Name,
            CustomerNumber = "CUS-" + invoice.Customer.CustomerNumber,
            IssueDate = invoice.IssueDate,
            DueDate = invoice.DueDate,
            Total = invoice.LineItems.Sum(LineItem => LineItem.Quantity * LineItem.UnitPrice),
            Status = invoice.Status.ToString(),
            Notes = invoice.Notes
        };
    }

    public async Task<InvoiceDetailDto?> GetByIdAsync(Guid id)
    {
        return await _db.Invoices
            .Where(i => i.Id == id)
            .Select(i => new InvoiceDetailDto
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
                Notes = i.Notes,
                LineItems = i.LineItems.Select(li => new InvoiceLineItemDto
                {
                    Id = li.Id,
                    Description = li.Description,
                    Quantity = li.Quantity,
                    UnitPrice = li.UnitPrice
                }).ToList()
            }).FirstOrDefaultAsync();
    }
}
