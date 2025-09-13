using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Description", "ImageUrl", "IsActive", "Name", "Price", "Stock" },
                values: new object[,]
                {
                    { 1, "This is a sample product", "https://via.placeholder.com/150", true, "Sample Product 1", 9.99m, 100 },
                    { 2, "This is another sample product", "https://via.placeholder.com/150", true, "Sample Product 2", 19.99m, 50 },
                    { 3, "This is yet another sample product", "https://via.placeholder.com/150", true, "Sample Product 3", 29.99m, 0 },
                    { 4, "This is a new sample product", "https://via.placeholder.com/150", true, "Sample Product 4", 39.99m, 20 },
                    { 5, "This is the fifth sample product", "https://via.placeholder.com/150", true, "Sample Product 5", 49.99m, 0 },
                    { 6, "Latest Apple iPhone 13", "https://via.placeholder.com/150", true, "iPhone 13", 999.99m, 50 },
                    { 7, "Apple MacBook Pro with M1 chip", "https://via.placeholder.com/150", true, "MacBook Pro", 1999.99m, 30 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
