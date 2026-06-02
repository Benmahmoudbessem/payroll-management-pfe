using PayrollManagementBackend.Common;

namespace PayrollManagementBackend.Models;

public class Payroll : BaseEntity
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal Bonus { get; set; }
    public decimal Allowance { get; set; }
    public decimal OvertimeAmount { get; set; }
    public decimal Deductions { get; set; }
    public decimal Contributions { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal NetSalary { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public PayrollValidationStatus ValidationStatus { get; set; } = PayrollValidationStatus.Draft;

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }

    public Payslip? Payslip { get; set; }
    public ICollection<PayrollHistory> Histories { get; set; } = new List<PayrollHistory>();
    public ICollection<Anomaly> Anomalies { get; set; } = new List<Anomaly>();
}
