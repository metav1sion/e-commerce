using System;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middlewares;

public class ExceptionHandling
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandling> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionHandling(RequestDelegate next, ILogger<ExceptionHandling> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var response = new ProblemDetails
            {
                Status = context.Response.StatusCode,
                Title = ex.Message,
                Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null
            };

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(json);
        }
    }
}
