namespace PayrollManagementBackend.Models;

public class Anomaly : BaseEntity
{
    public string AnomalyType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Score { get; set; }
    public string Status { get; set; } = "Detected";
    public DateTime DetectedAt { get; set; } = DateTime.UtcNow;

    public Guid PayrollId { get; set; }
    public Payroll? Payroll { get; set; }
}
