namespace PayrollManagementBackend.Models;

public class Contract : BaseEntity
{
    public string ContractType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal BaseSalary { get; set; }
    public string Status { get; set; } = "Active";

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
