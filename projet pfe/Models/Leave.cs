namespace PayrollManagementBackend.Models;

public class Leave : BaseEntity
{
    public string LeaveType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Approved";

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }

    public Guid? LeaveRequestId { get; set; }
    public LeaveRequest? LeaveRequest { get; set; }
}
