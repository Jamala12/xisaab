using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Domain.Enums;
using Xisaab.Infrastructure.Persistence;

namespace Xisaab.Infrastructure.Services;

public class PaymentService
{
    private readonly AppDbContext _db;

    public PaymentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<PaymentDto>> GetAllAsync()
    {
        return await _db.Payments.Select(p => new PaymentDto
        {
            Id = p.Id,
            InvoiceId = p.InvoiceId,
            PaymentNumber = "PAY-" + p.PaymentNumber,
            InvoiceNumber = "INV-" + p.Invoice.InvoiceNumber,
            CustomerName = p.Invoice.Customer.Name,
            CustomerNumber = "CUS-" + p.Invoice.Customer.CustomerNumber,
            Amount = p.Amount,
            PaymentDate = p.PaidAt,
            PaymentMethod = p.PaymentMethod.ToString(),
            Notes = p.Notes,
        }).ToListAsync();
    }

    public async Task<PaymentDto> CreateAsync(CreatePaymentDto dto)
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            InvoiceId = dto.InvoiceId,
            Amount = dto.Amount,
            PaidAt = dto.PaymentDate,
            PaymentMethod = Enum.Parse<PaymentMethod>(dto.PaymentMethod, true),
            Notes = dto.Notes,
        };

        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();

        var invoice = await _db.Invoices
            .Include(i => i.Customer)
            .Include(i => i.LineItems)
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == payment.InvoiceId);

        if (invoice!.IsFullyPaid)
        {
            invoice.Status = InvoiceStatus.Paid;
            await _db.SaveChangesAsync();
        }

        return new PaymentDto
        {
            Id = payment.Id,
            InvoiceId = payment.InvoiceId,
            PaymentNumber = "PAY-" + payment.PaymentNumber,
            InvoiceNumber = "INV-" + invoice!.InvoiceNumber,
            CustomerName = invoice.Customer.Name,
            CustomerNumber = "CUS-" + invoice.Customer.CustomerNumber,
            Amount = payment.Amount,
            PaymentDate = payment.PaidAt,
            PaymentMethod = payment.PaymentMethod.ToString(),
            Notes = payment.Notes,
        };
    }

    public async Task<PaymentDto?> GetByIdAsync(Guid id)
    {
        return await _db.Payments.Where(p => p.Id == id).Select(p => new PaymentDto
        {
            Id = p.Id,
            InvoiceId = p.InvoiceId,
            PaymentNumber = "PAY-" + p.PaymentNumber,
            InvoiceNumber = "INV-" + p.Invoice.InvoiceNumber,
            CustomerName = p.Invoice.Customer.Name,
            CustomerNumber = "CUS-" + p.Invoice.Customer.CustomerNumber,
            Amount = p.Amount,
            PaymentDate = p.PaidAt,
            PaymentMethod = p.PaymentMethod.ToString(),
            Notes = p.Notes,
        }).FirstOrDefaultAsync();
    }
}
