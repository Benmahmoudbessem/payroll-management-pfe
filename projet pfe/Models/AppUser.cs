using Microsoft.AspNetCore.Identity;

namespace PayrollManagementBackend.Models;

public class AppUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public Guid? EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
