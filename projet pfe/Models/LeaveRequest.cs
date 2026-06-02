using PayrollManagementBackend.Common;

namespace PayrollManagementBackend.Models;

public class LeaveRequest : BaseEntity
{
    public string LeaveType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public LeaveRequestStatus Status { get; set; } = LeaveRequestStatus.Pending;
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
