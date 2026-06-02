using PayrollManagementBackend.Common;

namespace PayrollManagementBackend.Services;

public interface INotificationRealtimeService
{
    Task NotifyAsync(Guid employeeId, string title, string message, NotificationType type);
}