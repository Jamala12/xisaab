using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Xisaab.Domain.Entities;

namespace Xisaab.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLineItem> InvoiceLineItems => Set<InvoiceLineItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Business> Businesses => Set<Business>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>()
            .Property(c => c.CustomerNumber)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Invoice>()
            .Property(i => i.InvoiceNumber)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Business>()
            .Property(b => b.BusinessNumber)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Payment>()
            .Property (p => p.PaymentNumber)
            .ValueGeneratedOnAdd();
    }
}