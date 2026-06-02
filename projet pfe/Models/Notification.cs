using PayrollManagementBackend.Common;

namespace PayrollManagementBackend.Models;

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    public NotificationType Type { get; set; }

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }
}
