using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }
    public DbSet<Product> Products { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().Property(p => p.CreatedAt)
        .HasDefaultValueSql("CURRENT_TIMESTAMP");

        modelBuilder.Entity<Product>().HasData(
            new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Sample Product 1",
                    Description = "This is a sample product",
                    Price = 9.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 100
                },
                new Product
                {
                    Id = 2,
                    Name = "Sample Product 2",
                    Description = "This is another sample product",
                    Price = 19.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 50
                },
                new Product
                {
                    Id = 3,
                    Name = "Sample Product 3",
                    Description = "This is yet another sample product",
                    Price = 29.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 0
                },
                new Product
                {
                    Id = 4,
                    Name = "Sample Product 4",
                    Description = "This is a new sample product",
                    Price = 39.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 20
                },
                new Product
                {
                    Id = 5,
                    Name = "Sample Product 5",
                    Description = "This is the fifth sample product",
                    Price = 49.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 0
                },
                new Product
                {
                    Id = 6,
                    Name = "iPhone 13",
                    Description = "Latest Apple iPhone 13",
                    Price = 999.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 50
                },
                new Product
                {
                    Id = 7,
                    Name = "MacBook Pro",
                    Description = "Apple MacBook Pro with M1 chip",
                    Price = 1999.99M,
                    IsActive = true,
                    ImageUrl = "https://via.placeholder.com/150",
                    Stock = 30
                }

            }
        );
    }
}
