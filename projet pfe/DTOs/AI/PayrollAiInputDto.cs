namespace PayrollManagementBackend.DTOs.AI;

public class PayrollAiInputDto
{
    public Guid PayrollId { get; set; }
    public Guid EmployeeId { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal Bonus { get; set; }
    public decimal Allowance { get; set; }
    public decimal OvertimeAmount { get; set; }
    public decimal Deductions { get; set; }
    public decimal Contributions { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal NetSalary { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
}