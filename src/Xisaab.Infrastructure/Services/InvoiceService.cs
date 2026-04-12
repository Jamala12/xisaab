using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Domain.Enums;
using Xisaab.Infrastructure.Persistence;

namespace Xisaab.Infrastructure.Services;

public class InvoiceService
{
    private readonly AppDbContext _db;
    private readonly CurrentUserService _currentUser;
    public InvoiceService(AppDbContext db, CurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<List<InvoiceDto>> GetAllAsync()
    {
        return await _db.Invoices
            .Where(i => i.BusinessId == _currentUser.BusinessId)
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

    public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto)
    {
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            BusinessId = _currentUser.BusinessId,
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
            CustomerName = customer!.Name,
            CustomerNumber = "CUS-" + customer.CustomerNumber,
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
            .Where(i => i.Id == id && i.BusinessId == _currentUser.BusinessId)
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
                }).ToList(),
                Payments = i.Payments.Select(p => new InvoicePaymentDto
                {
                    Id = p.Id,
                    PaymentNumber = "PAY-" + p.PaymentNumber,
                    Amount = p.Amount,
                    PaymentDate = p.PaidAt,
                    PaymentMethod = p.PaymentMethod.ToString(),
                    Notes = p.Notes
                }).ToList()
            }).FirstOrDefaultAsync();
    }

    public async Task<ServiceResult> UpdateStatusAsync(Guid id, string status)
    {
        var invoice = await _db.Invoices
            .FirstOrDefaultAsync(i => i.Id == id && i.BusinessId == _currentUser.BusinessId);
        if (invoice == null) return ServiceResult.NotFound;
        InvoiceStatus newStatus = Enum.Parse<InvoiceStatus>(status);
        invoice.Status = newStatus;
        await _db.SaveChangesAsync();
        return ServiceResult.Success;
    }

    public async Task<ServiceResult> UpdateInvoiceAsync(Guid id, UpdateInvoiceDto dto)
    {
        var invoice = await _db.Invoices
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == id && i.BusinessId == _currentUser.BusinessId);
        if (invoice == null) return ServiceResult.NotFound;

        var hasPayments = await _db.Payments.AnyAsync(p => p.InvoiceId == id);
        if (hasPayments)
            return ServiceResult.Blocked;

        invoice.IssueDate = dto.IssueDate;
        invoice.DueDate = dto.DueDate;
        invoice.Notes = dto.Notes;

        invoice.LineItems.Clear();
        foreach (var item in dto.Items)
        {
            invoice.LineItems.Add(new InvoiceLineItem
            {
                Id = Guid.NewGuid(),
                InvoiceId = id,
                Description = item.description,
                Quantity = item.quantity,
                UnitPrice = item.unitPrice,
            });
        }
        await _db.SaveChangesAsync();
        return ServiceResult.Success;
    }
        
    public async Task<ServiceResult> DeleteAsync(Guid id)
    {
        var invoice = await _db.Invoices
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.Id == id && i.BusinessId == _currentUser.BusinessId);
        if (invoice == null) return ServiceResult.NotFound;
        var hasPayments = await _db.Payments.AnyAsync(p => p.InvoiceId == id);
        if (hasPayments)
            return ServiceResult.Blocked;
        _db.Invoices.Remove(invoice);
        await _db.SaveChangesAsync();
        return ServiceResult.Success;
    }
}
