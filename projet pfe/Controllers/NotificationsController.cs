using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Data;


namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotificationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var notifications = await _context.Notifications
            .Include(x => x.Employee)
            .OrderByDescending(x => x.SentAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Message,
                Type = x.Type.ToString(),
                x.SentAt,
                x.IsRead,
                x.EmployeeId,
                Employee = x.Employee == null ? null : new
                {
                    x.Employee.Id,
                    x.Employee.FirstName,
                    x.Employee.LastName,
                    x.Employee.Matricule
                }
            })
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpGet("employee/{employeeId:guid}")]
    public async Task<IActionResult> GetByEmployee(Guid employeeId)
    {
        var notifications = await _context.Notifications
            .Include(x => x.Employee)
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.SentAt)
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Message,
                Type = x.Type.ToString(),
                x.SentAt,
                x.IsRead,
                x.EmployeeId,
                Employee = x.Employee == null ? null : new
                {
                    x.Employee.Id,
                    x.Employee.FirstName,
                    x.Employee.LastName,
                    x.Employee.Matricule
                }
            })
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var notification = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notification == null)
            return NotFound(new { message = "Notification introuvable." });

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Notification marquee comme lue." });
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var notification = await _context.Notifications.FindAsync(id);

        if (notification == null)
            return NotFound();

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}