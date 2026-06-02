namespace PayrollManagementBackend.Models;

public class PayrollHistory : BaseEntity
{
    public DateTime ModificationDate { get; set; } = DateTime.UtcNow;
    public string OldValue { get; set; } = string.Empty;
    public string NewValue { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;

    public Guid PayrollId { get; set; }
    public Payroll? Payroll { get; set; }
}
