using Microsoft.AspNetCore.SignalR;

namespace PayrollManagementBackend.Hubs;

public class NotificationsHub : Hub
{
    public async Task JoinEmployeeGroup(string employeeId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"employee-{employeeId}");
    }

    public async Task JoinAdminRhGroup()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "admin-rh");
    }
}