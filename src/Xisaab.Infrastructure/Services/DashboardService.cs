using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Enums;
using Xisaab.Infrastructure.Persistence;

namespace Xisaab.Infrastructure.Services;

public class DashboardService
{
    private readonly AppDbContext _db;
    private readonly CurrentUserService _currentUser;
    public DashboardService(AppDbContext db, CurrentUserService currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }
    public async Task<DashboardDto> GetDashboardAsync()
    {
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

        var totalCustomers = await _db.Customers
            .Where(d => d.BusinessId == _currentUser.BusinessId)
            .CountAsync();
        var totalInvoices = await _db.Invoices
            .Where(d => d.BusinessId == _currentUser.BusinessId)
            .CountAsync(i => i.IssueDate >= thirtyDaysAgo);
        var totalDraft = await _db.Invoices
            .Where(d => d.BusinessId == _currentUser.BusinessId)
            .CountAsync(i => i.Status == InvoiceStatus.Draft);
        var totalSent = await _db.Invoices
            .Where(d => d.BusinessId == _currentUser.BusinessId)
            .CountAsync(i => i.Status == InvoiceStatus.Sent);
        var totalOverdue = await _db.Invoices
            .Where(d => d.BusinessId == _currentUser.BusinessId)
            .CountAsync(i => i.Status == InvoiceStatus.Overdue);
        var totalAmountPaid = await _db.Payments
            .Where(p => p.PaidAt >= thirtyDaysAgo && p.BusinessId == _currentUser.BusinessId)
            .SumAsync(p => p.Amount);
        var totalAmountOverdue = await _db.Invoices
            .Where(i => i.Status == InvoiceStatus.Overdue && i.BusinessId == _currentUser.BusinessId)
            .SelectMany(i => i.LineItems)
            .SumAsync(l => l.Quantity * l.UnitPrice);
        var recentInvoices = await _db.Invoices
            .Where(i => i.BusinessId == _currentUser.BusinessId)
            .OrderByDescending(i => i.IssueDate)
            .Take(5)
            .Select(i => new InvoiceDto
            {
                Id = i.Id,
                InvoiceNumber = "INV-" + i.InvoiceNumber,
                CustomerId = i.CustomerId,
                CustomerName = i.Customer.Name,
                CustomerNumber = "CUS-" + i.Customer.CustomerNumber,
                IssueDate = i.IssueDate,
                DueDate = i.DueDate,
                Total = i.LineItems.Sum(l => l.Quantity * l.UnitPrice),
                Status = i.Status.ToString(),
                Notes = i.Notes
            }).ToListAsync();

        return new DashboardDto
        {
            TotalCustomers = totalCustomers,
            TotalInvoices = totalInvoices,
            TotalDraftInvoices = totalDraft,
            TotalSentInvoices = totalSent,
            TotalOverdueInvoices = totalOverdue,
            TotalAmountPaid = totalAmountPaid,
            TotalAmountOverdue = totalAmountOverdue,
            RecentInvoices = recentInvoices
        };
    }
}