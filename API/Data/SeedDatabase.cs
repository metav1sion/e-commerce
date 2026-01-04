using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public class SeedDatabase
{
    public static async Task Initialize(IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AppRole>>();
        
        if (!roleManager.Roles.Any())
        {
            var customer = new AppRole { Name = "Customer" };
            var admin = new AppRole { Name = "Admin" };
            
            await roleManager.CreateAsync(customer);
            await roleManager.CreateAsync(admin);
        }

        if (!userManager.Users.Any())
        {
            var customerUser = new AppUser
            {
                UserName = "yigitemresozen",
                Email = "test@test.com",
                Name = "Yiğit Emre Sözen"
            };
            var adminUser = new AppUser
            {
                UserName = "metehansozen",
                Email = "test1@test.com",
                Name = "Metehan Sözen"
            };
            await userManager.CreateAsync(customerUser, "Metehan1907.");
            await userManager.AddToRoleAsync(customerUser, "Customer");
            await userManager.CreateAsync(adminUser, "Metehan1907.");
            await userManager.AddToRolesAsync(adminUser, ["Admin", "Customer"]);
        }
    }
}