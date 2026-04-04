using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Xisaab.Domain.Entities;
using Xisaab.Domain.Enums;

namespace Xisaab.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Businesses.Any()) return;

        // Business
        var business = new Business
        {
            Id = Guid.NewGuid(),
            Name = "Demo Trading Co",
            Email = "demo@xisaab.com",
            CreatedAt = DateTime.UtcNow,
            Tier = BusinessTier.Free
        };
        await db.Businesses.AddAsync(business);
        await db.SaveChangesAsync();

        // User
        var passwordHasher = new PasswordHasher<User>();
        var user = new User
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            Email = "demo@xisaab.com",
            PasswordHash = passwordHasher.HashPassword(new User(), "hamse123"),
            CreatedAt = DateTime.UtcNow
        };
        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();

        // Customers
        var customer1 = new Customer { Id = Guid.NewGuid(), BusinessId = business.Id, Name = "Ahmed Ali", Phone = "063-4123456", Email = "ahmed@example.com", CreatedAt = DateTime.UtcNow };
        var customer2 = new Customer { Id = Guid.NewGuid(), BusinessId = business.Id, Name = "Faadumo Hassan", Phone = "063-7654321", Email = "faadumo@example.com", CreatedAt = DateTime.UtcNow };
        var customer3 = new Customer { Id = Guid.NewGuid(), BusinessId = business.Id, Name = "Ali Jama", Phone = "063-9084523", Email = "ali@example.com", CreatedAt = DateTime.UtcNow };
        await db.Customers.AddRangeAsync(customer1, customer2, customer3);
        await db.SaveChangesAsync();

        // Invoices
        var invoice1 = new Invoice
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            CustomerId = customer1.Id,
            IssueDate = DateTime.UtcNow.AddDays(-20),
            DueDate = DateTime.UtcNow.AddDays(10),
            Status = InvoiceStatus.Sent,
            Notes = "Web Design Project",
            LineItems = new List<InvoiceLineItem>
            {
                new() { Id = Guid.NewGuid(), Description = "Website Design", Quantity = 1, UnitPrice = 500 },
                new() { Id = Guid.NewGuid(), Description = "Hosting Setup", Quantity = 2, UnitPrice = 75 }
            }
        };

        var invoice2 = new Invoice
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            CustomerId = customer2.Id,
            IssueDate = DateTime.UtcNow.AddDays(-45),
            DueDate = DateTime.UtcNow.AddDays(-15),
            Status = InvoiceStatus.Overdue,
            Notes = "Grocery Supply",
            LineItems = new List<InvoiceLineItem>
            {
                new() { Id = Guid.NewGuid(), Description = "Rice 50kg", Quantity = 3, UnitPrice = 80 },
                new() { Id = Guid.NewGuid(), Description = "Sugar 25kg", Quantity = 2, UnitPrice = 45 }
            }
        };

        var invoice3 = new Invoice
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            CustomerId = customer3.Id,
            IssueDate = DateTime.UtcNow.AddDays(-10),
            DueDate = DateTime.UtcNow.AddDays(20),
            Status = InvoiceStatus.Draft,
            Notes = "Car Parts Supply",
            LineItems = new List<InvoiceLineItem>
            {
                new() { Id = Guid.NewGuid(), Description = "Brake Pads", Quantity = 4, UnitPrice = 45 },
                new() { Id = Guid.NewGuid(), Description = "Oil Filter", Quantity = 2, UnitPrice = 15 }
            }
        };

        var invoice4 = new Invoice
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            CustomerId = customer1.Id,
            IssueDate = DateTime.UtcNow.AddDays(-30),
            DueDate = DateTime.UtcNow.AddDays(-5),
            Status = InvoiceStatus.Paid,
            Notes = "Logo Design",
            LineItems = new List<InvoiceLineItem>
            {
                new() { Id = Guid.NewGuid(), Description = "Logo Design", Quantity = 1, UnitPrice = 200 }
            }
        };

        await db.Invoices.AddRangeAsync(invoice1, invoice2, invoice3, invoice4);
        await db.SaveChangesAsync();

        // Payments
        var payment1 = new Payment
        {
            Id = Guid.NewGuid(),
            BusinessId = business.Id,
            InvoiceId = invoice4.Id,
            Amount = 200,
            PaidAt = DateTime.UtcNow.AddDays(-3),
            PaymentMethod = PaymentMethod.Cash,
            Notes = "Full payment received"
        };

        await db.Payments.AddAsync(payment1);
        await db.SaveChangesAsync();
    }
}