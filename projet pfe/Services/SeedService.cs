using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Services;

public class SeedService : ISeedService
{
    private readonly IServiceProvider _serviceProvider;

    public SeedService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task SeedAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

        await context.Database.MigrateAsync();

        string[] roles = ["Admin", "RH", "Employee"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        if (!context.Departments.Any())
        {
            context.Departments.AddRange(
                new Department { Name = "Ressources Humaines", Description = "Gestion RH" },
                new Department { Name = "Informatique", Description = "Développement et maintenance" },
                new Department { Name = "Comptabilité", Description = "Gestion comptable" }
            );
            await context.SaveChangesAsync();
        }

        if (await userManager.FindByEmailAsync("admin@payroll.com") is null)
        {
            var admin = new AppUser
            {
                FullName = "System Admin",
                UserName = "admin@payroll.com",
                Email = "admin@payroll.com",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
