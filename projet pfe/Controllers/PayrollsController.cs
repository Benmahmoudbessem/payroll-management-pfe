using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Common;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.DTOs.Payroll;
using PayrollManagementBackend.Services;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PayrollsController : ControllerBase
{
    private readonly IPayrollService _payrollService;
    private readonly AppDbContext _context;
    private readonly INotificationRealtimeService _notificationService;
    private readonly IAnomalyService _anomalyService;

    public PayrollsController(
        IPayrollService payrollService,
        AppDbContext context,
        INotificationRealtimeService notificationService,
        IAnomalyService anomalyService)
    {
        _payrollService = payrollService;
        _context = context;
        _notificationService = notificationService;
        _anomalyService = anomalyService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> GetAll()
    {
        var payrolls = await _payrollService.GetAllAsync();

        var result = payrolls.Select(p => new
        {
            p.Id,
            p.EmployeeId,
            p.Month,
            p.Year,
            p.BaseSalary,
            p.Bonus,
            p.Allowance,
            p.OvertimeAmount,
            p.Deductions,
            p.Contributions,
            p.GrossSalary,
            p.NetSalary,
            p.GeneratedAt,
            p.ValidationStatus,
            Employee = p.Employee == null ? null : new
            {
                p.Employee.Id,
                p.Employee.FirstName,
                p.Employee.LastName,
                p.Employee.Matricule
            }
        });

        return Ok(result);
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMine()
    {
        var employeeIdClaim = User.FindFirst("employeeId")?.Value;

        if (string.IsNullOrWhiteSpace(employeeIdClaim) || !Guid.TryParse(employeeIdClaim, out var employeeId))
            return Forbid();

        var payrolls = await _payrollService.GetAllAsync();

        var result = payrolls
            .Where(p => p.EmployeeId == employeeId)
            .Select(p => new
            {
                p.Id,
                p.EmployeeId,
                p.Month,
                p.Year,
                p.BaseSalary,
                p.Bonus,
                p.Allowance,
                p.OvertimeAmount,
                p.Deductions,
                p.Contributions,
                p.GrossSalary,
                p.NetSalary,
                p.GeneratedAt,
                p.ValidationStatus,
                Employee = p.Employee == null ? null : new
                {
                    p.Employee.Id,
                    p.Employee.FirstName,
                    p.Employee.LastName,
                    p.Employee.Matricule
                }
            });

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var payroll = await _context.Payrolls
            .Include(p => p.Employee)
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.EmployeeId,
                p.Month,
                p.Year,
                p.BaseSalary,
                p.Bonus,
                p.Allowance,
                p.OvertimeAmount,
                p.Deductions,
                p.Contributions,
                p.GrossSalary,
                p.NetSalary,
                p.GeneratedAt,
                p.ValidationStatus,
                Employee = p.Employee == null ? null : new
                {
                    p.Employee.Id,
                    p.Employee.FirstName,
                    p.Employee.LastName,
                    p.Employee.Matricule
                }
            })
            .FirstOrDefaultAsync();

        if (payroll == null)
            return NotFound(new { message = "Paie introuvable." });

        if (User.IsInRole("Employee"))
        {
            var employeeIdClaim = User.FindFirst("employeeId")?.Value;

            if (string.IsNullOrWhiteSpace(employeeIdClaim) ||
                !Guid.TryParse(employeeIdClaim, out var currentEmployeeId) ||
                payroll.EmployeeId != currentEmployeeId)
            {
                return Forbid();
            }
        }

        return Ok(payroll);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Create([FromBody] CreatePayrollDto dto)
    {
        var payroll = await _payrollService.CreatePayrollAsync(dto);

        payroll.ValidationStatus = PayrollValidationStatus.Validated;
        await _context.SaveChangesAsync();

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == payroll.EmployeeId);

        var actorName = User.Identity?.Name ?? "Utilisateur";
        var actorRole = User.IsInRole("Admin") ? "Admin" : "RH";

        await _notificationService.NotifyAsync(
            payroll.EmployeeId,
            "Fiche de paie generee",
            $"Une fiche de paie a ete generee pour {employee?.FirstName} {employee?.LastName} ({payroll.Month}/{payroll.Year}) par {actorRole} {actorName}. Salaire net: {payroll.NetSalary}.",
            NotificationType.PayrollGenerated
        );

        var anomalies = await _anomalyService.DetectForPayrollAsync(payroll.Id);

        foreach (var anomaly in anomalies)
        {
            await _notificationService.NotifyAsync(
                payroll.EmployeeId,
                "Anomalie detectee dans la paie",
                $"Une anomalie de type '{anomaly.AnomalyType}' a ete detectee pour {employee?.FirstName} {employee?.LastName}. Detail: {anomaly.Description}",
                NotificationType.PayrollAnomaly
            );
        }

        return Ok(new
        {
            payroll.Id,
            payroll.EmployeeId,
            payroll.Month,
            payroll.Year,
            payroll.BaseSalary,
            payroll.Bonus,
            payroll.Allowance,
            payroll.OvertimeAmount,
            payroll.Deductions,
            payroll.Contributions,
            payroll.GrossSalary,
            payroll.NetSalary,
            payroll.GeneratedAt,
            payroll.ValidationStatus
        });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreatePayrollDto dto)
    {
        var payroll = await _context.Payrolls.FirstOrDefaultAsync(p => p.Id == id);
        if (payroll == null)
            return NotFound(new { message = "Paie introuvable." });

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
        if (employee == null)
            return BadRequest(new { message = "Employé introuvable." });

        payroll.EmployeeId = dto.EmployeeId;
        payroll.Month = dto.Month;
        payroll.Year = dto.Year;
        payroll.BaseSalary = employee.BaseSalary;
        payroll.Bonus = dto.Bonus;
        payroll.Allowance = dto.Allowance;
        payroll.OvertimeAmount = dto.OvertimeAmount;
        payroll.Deductions = dto.Deductions;
        payroll.Contributions = dto.Contributions;

        payroll.GrossSalary = payroll.BaseSalary + payroll.Bonus + payroll.Allowance + payroll.OvertimeAmount;
        payroll.NetSalary = payroll.GrossSalary - payroll.Deductions - payroll.Contributions;
        payroll.GeneratedAt = DateTime.UtcNow;
        payroll.ValidationStatus = PayrollValidationStatus.Validated;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            payroll.Id,
            payroll.EmployeeId,
            payroll.Month,
            payroll.Year,
            payroll.BaseSalary,
            payroll.Bonus,
            payroll.Allowance,
            payroll.OvertimeAmount,
            payroll.Deductions,
            payroll.Contributions,
            payroll.GrossSalary,
            payroll.NetSalary,
            payroll.GeneratedAt,
            payroll.ValidationStatus
        });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var payroll = await _context.Payrolls.FirstOrDefaultAsync(p => p.Id == id);
        if (payroll == null)
            return NotFound(new { message = "Paie introuvable." });

        _context.Payrolls.Remove(payroll);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Paie supprimée avec succès." });
    }

    [HttpGet("prediction")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Predict([FromQuery] int month, [FromQuery] int year)
    {
        try
        {
            var result = await _payrollService.PredictSalaryMassAsync(month, year);

            return Ok(new
            {
                result.Id,
                result.Month,
                result.Year,
                result.PredictedSalaryMass,
                result.EvolutionRate,
                result.PredictionDate,
                result.Notes
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Erreur interne lors de la prédiction de masse salariale.",
                detail = ex.Message
            });
        }
    }

    [HttpGet("employee/{employeeId:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> GetByEmployee(Guid employeeId)
    {
        var payrolls = await _payrollService.GetAllAsync();

        var result = payrolls
            .Where(p => p.EmployeeId == employeeId)
            .Select(p => new
            {
                p.Id,
                p.EmployeeId,
                p.Month,
                p.Year,
                p.BaseSalary,
                p.Bonus,
                p.Allowance,
                p.OvertimeAmount,
                p.Deductions,
                p.Contributions,
                p.GrossSalary,
                p.NetSalary,
                p.GeneratedAt,
                p.ValidationStatus,
                Employee = p.Employee == null ? null : new
                {
                    p.Employee.Id,
                    p.Employee.FirstName,
                    p.Employee.LastName,
                    p.Employee.Matricule
                }
            });

        return Ok(result);
    }
}