using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Xisaab.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessMultiTenancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BusinessId",
                table: "Users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "BusinessId",
                table: "Payments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "PaymentNumber",
                table: "Payments",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<Guid>(
                name: "BusinessId",
                table: "Invoices",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "BusinessId",
                table: "Customers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Businesses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    BusinessNumber = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Tier = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Businesses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_BusinessId",
                table: "Users",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BusinessId",
                table: "Payments",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_BusinessId",
                table: "Invoices",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_BusinessId",
                table: "Customers",
                column: "BusinessId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Businesses_BusinessId",
                table: "Customers",
                column: "BusinessId",
                principalTable: "Businesses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Businesses_BusinessId",
                table: "Invoices",
                column: "BusinessId",
                principalTable: "Businesses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Businesses_BusinessId",
                table: "Payments",
                column: "BusinessId",
                principalTable: "Businesses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Businesses_BusinessId",
                table: "Users",
                column: "BusinessId",
                principalTable: "Businesses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Businesses_BusinessId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Businesses_BusinessId",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Businesses_BusinessId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Businesses_BusinessId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Businesses");

            migrationBuilder.DropIndex(
                name: "IX_Users_BusinessId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Payments_BusinessId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_BusinessId",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Customers_BusinessId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "BusinessId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BusinessId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "PaymentNumber",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "BusinessId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "BusinessId",
                table: "Customers");
        }
    }
}
