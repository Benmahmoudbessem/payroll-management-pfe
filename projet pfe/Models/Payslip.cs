namespace PayrollManagementBackend.Models;

public class Payslip : BaseEntity
{
    public string FilePath { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public Guid PayrollId { get; set; }
    public Payroll? Payroll { get; set; }
}
