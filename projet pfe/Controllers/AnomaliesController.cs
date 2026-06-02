using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Data;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnomaliesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnomaliesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> GetAll()
    {
        var anomalies = await _context.Anomalies
            .Include(a => a.Payroll)
                .ThenInclude(p => p.Employee)
            .OrderByDescending(a => a.DetectedAt)
            .Select(a => new
            {
                a.Id,
                a.PayrollId,
                a.AnomalyType,
                a.Description,
                a.Score,
                a.Status,
                a.DetectedAt,
                Payroll = a.Payroll == null ? null : new
                {
                    a.Payroll.Id,
                    a.Payroll.Month,
                    a.Payroll.Year,
                    a.Payroll.NetSalary,
                    Employee = a.Payroll.Employee == null ? null : new
                    {
                        a.Payroll.Employee.Id,
                        a.Payroll.Employee.FirstName,
                        a.Payroll.Employee.LastName,
                        a.Payroll.Employee.Matricule
                    }
                }
            })
            .ToListAsync();

        return Ok(anomalies);
    }

    [HttpGet("employee/{employeeId:guid}")]
    public async Task<IActionResult> GetByEmployee(Guid employeeId)
    {
        var anomalies = await _context.Anomalies
            .Include(a => a.Payroll)
                .ThenInclude(p => p.Employee)
            .Where(a => a.Payroll.EmployeeId == employeeId)
            .OrderByDescending(a => a.DetectedAt)
            .Select(a => new
            {
                a.Id,
                a.PayrollId,
                a.AnomalyType,
                a.Description,
                a.Score,
                a.Status,
                a.DetectedAt,
                Payroll = a.Payroll == null ? null : new
                {
                    a.Payroll.Id,
                    a.Payroll.Month,
                    a.Payroll.Year,
                    a.Payroll.NetSalary
                }
            })
            .ToListAsync();

        return Ok(anomalies);
    }
}