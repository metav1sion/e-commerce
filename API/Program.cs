using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString);
});

builder.Services.AddCors();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<API.Middlewares.ExceptionHandling>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Demo API v1");
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthorization();

app.UseCors(opt =>
{
    opt.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.MapControllers();

app.Run();
