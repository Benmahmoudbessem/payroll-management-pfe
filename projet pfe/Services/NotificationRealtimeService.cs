using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Common;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.Hubs;
using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Services;

public class NotificationRealtimeService : INotificationRealtimeService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationsHub> _hubContext;

    public NotificationRealtimeService(AppDbContext context, IHubContext<NotificationsHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task NotifyAsync(Guid employeeId, string title, string message, NotificationType type)
    {
        var notification = new Notification
        {
            EmployeeId = employeeId,
            Title = title,
            Message = message,
            Type = type,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        var employee = await _context.Employees
            .Where(e => e.Id == employeeId)
            .Select(e => new
            {
                e.Id,
                e.FirstName,
                e.LastName,
                e.Matricule
            })
            .FirstOrDefaultAsync();

        var payload = new
        {
            notification.Id,
            notification.Title,
            notification.Message,
            Type = notification.Type.ToString(),
            notification.SentAt,
            notification.IsRead,
            notification.EmployeeId,
            Employee = employee
        };

        await _hubContext.Clients.Group("admin-rh").SendAsync("ReceiveNotification", payload);
        await _hubContext.Clients.Group($"employee-{employeeId}").SendAsync("ReceiveNotification", payload);
    }
}