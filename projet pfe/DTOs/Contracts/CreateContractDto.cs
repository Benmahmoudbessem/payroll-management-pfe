namespace PayrollManagementBackend.DTOs.Contracts;

public class CreateContractDto
{
    public Guid EmployeeId { get; set; }
    public string ContractType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal BaseSalary { get; set; }
    public string Status { get; set; } = "Active";
}
