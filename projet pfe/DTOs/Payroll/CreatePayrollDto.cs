namespace PayrollManagementBackend.DTOs.Payroll;

public class CreatePayrollDto
{
    public Guid EmployeeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal Bonus { get; set; }
    public decimal Allowance { get; set; }
    public decimal OvertimeAmount { get; set; }
    public decimal Deductions { get; set; }
    public decimal Contributions { get; set; }
}
