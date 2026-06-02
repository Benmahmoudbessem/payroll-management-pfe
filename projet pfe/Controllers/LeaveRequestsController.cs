using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Common;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.DTOs.Leaves;
using PayrollManagementBackend.Models;
using PayrollManagementBackend.Services;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveRequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationRealtimeService _notificationService;

    public LeaveRequestsController(AppDbContext context, INotificationRealtimeService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _context.LeaveRequests
            .Include(x => x.Employee)
            .OrderByDescending(x => x.StartDate)
            .Select(x => new
            {
                x.Id,
                x.EmployeeId,
                x.LeaveType,
                x.StartDate,
                x.EndDate,
                x.Reason,
                Status = x.Status.ToString(),
                x.RequestDate,
                Employee = x.Employee == null ? null : new
                {
                    x.Employee.Id,
                    x.Employee.FirstName,
                    x.Employee.LastName,
                    x.Employee.Matricule
                }
            })
            .ToListAsync();

        return Ok(requests);
    }
    [HttpGet("mine")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMine()
    {
        var employeeIdClaim = User.FindFirst("employeeId")?.Value;

        if (string.IsNullOrWhiteSpace(employeeIdClaim) || !Guid.TryParse(employeeIdClaim, out var employeeId))
            return Forbid();

        var requests = await _context.LeaveRequests
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.StartDate)
            .Select(x => new
            {
                x.Id,
                x.EmployeeId,
                x.LeaveType,
                x.StartDate,
                x.EndDate,
                x.Reason,
                Status = x.Status.ToString(),
                x.RequestDate
            })
            .ToListAsync();

        return Ok(requests);
    }
    [HttpGet("employee/{employeeId:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> GetByEmployee(Guid employeeId)
    {
        var requests = await _context.LeaveRequests
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.StartDate)
            .Select(x => new
            {
                x.Id,
                x.EmployeeId,
                x.LeaveType,
                x.StartDate,
                x.EndDate,
                x.Reason,
                Status = x.Status.ToString(),
                x.RequestDate
            })
            .ToListAsync();

        return Ok(requests);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLeaveRequestDto dto)
    {
        Guid employeeId;

        if (User.IsInRole("Employee"))
        {
            var employeeIdClaim = User.FindFirst("employeeId")?.Value;

            if (string.IsNullOrWhiteSpace(employeeIdClaim) || !Guid.TryParse(employeeIdClaim, out employeeId))
                return Forbid();
        }
        else
        {
            employeeId = dto.EmployeeId;
        }

        var request = new LeaveRequest
        {
            EmployeeId = employeeId,
            LeaveType = dto.LeaveType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Reason = dto.Reason,
            Status = LeaveRequestStatus.Pending,
            RequestDate = DateTime.UtcNow
        };

        _context.LeaveRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            request.Id,
            request.EmployeeId,
            request.LeaveType,
            request.StartDate,
            request.EndDate,
            request.Reason,
            Status = request.Status.ToString(),
            request.RequestDate
        });
    }

    [HttpPut("{id:guid}/approve")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var request = await _context.LeaveRequests
            .Include(x => x.Employee)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (request is null) return NotFound();

        request.Status = LeaveRequestStatus.Approved;

        _context.Leaves.Add(new Leave
        {
            EmployeeId = request.EmployeeId,
            LeaveRequestId = request.Id,
            LeaveType = request.LeaveType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = "Approved"
        });

        await _context.SaveChangesAsync();

        var actorName = User.Identity?.Name ?? "Utilisateur";
        var actorRole = User.IsInRole("Admin") ? "Admin" : "RH";

        await _notificationService.NotifyAsync(
            request.EmployeeId,
            "Demande de conge approuvee",
            $"La demande de conge de {request.Employee?.FirstName} {request.Employee?.LastName} du {request.StartDate:dd/MM/yyyy} au {request.EndDate:dd/MM/yyyy} a ete approuvee par {actorRole} {actorName}.",
            NotificationType.LeaveApproved
        );

        return Ok(new
        {
            request.Id,
            request.EmployeeId,
            request.LeaveType,
            request.StartDate,
            request.EndDate,
            request.Reason,
            Status = request.Status.ToString()
        });
    }

    [HttpPut("{id:guid}/reject")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var request = await _context.LeaveRequests
            .Include(x => x.Employee)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (request is null) return NotFound();

        request.Status = LeaveRequestStatus.Rejected;
        await _context.SaveChangesAsync();

        var actorName = User.Identity?.Name ?? "Utilisateur";
        var actorRole = User.IsInRole("Admin") ? "Admin" : "RH";

        await _notificationService.NotifyAsync(
            request.EmployeeId,
            "Demande de conge rejetee",
            $"La demande de conge de {request.Employee?.FirstName} {request.Employee?.LastName} du {request.StartDate:dd/MM/yyyy} au {request.EndDate:dd/MM/yyyy} a ete rejetee par {actorRole} {actorName}.",
            NotificationType.LeaveRejected
        );

        return Ok(new
        {
            request.Id,
            request.EmployeeId,
            request.LeaveType,
            request.StartDate,
            request.EndDate,
            request.Reason,
            Status = request.Status.ToString()
        });
    }
}