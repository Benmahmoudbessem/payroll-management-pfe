using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Common;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.DTOs.Contracts;
using PayrollManagementBackend.Models;
using PayrollManagementBackend.Services;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContractsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationRealtimeService _notificationService;

    public ContractsController(AppDbContext context, INotificationRealtimeService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var contracts = await _context.Contracts
            .Include(x => x.Employee)
            .OrderByDescending(x => x.StartDate)
            .Select(x => new
            {
                x.Id,
                x.EmployeeId,
                x.ContractType,
                x.StartDate,
                x.EndDate,
                x.BaseSalary,
                x.Status,
                Employee = x.Employee == null ? null : new
                {
                    x.Employee.Id,
                    x.Employee.FirstName,
                    x.Employee.LastName,
                    x.Employee.Matricule
                }
            })
            .ToListAsync();

        return Ok(contracts);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var contract = await _context.Contracts
            .Include(x => x.Employee)
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.EmployeeId,
                x.ContractType,
                x.StartDate,
                x.EndDate,
                x.BaseSalary,
                x.Status,
                Employee = x.Employee == null ? null : new
                {
                    x.Employee.Id,
                    x.Employee.FirstName,
                    x.Employee.LastName,
                    x.Employee.Matricule
                }
            })
            .FirstOrDefaultAsync();

        if (contract == null)
            return NotFound(new { message = "Contrat introuvable." });

        return Ok(contract);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Create([FromBody] CreateContractDto dto)
    {
        var contract = new Contract
        {
            EmployeeId = dto.EmployeeId,
            ContractType = dto.ContractType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            BaseSalary = dto.BaseSalary,
            Status = dto.Status
        };

        _context.Contracts.Add(contract);
        await _context.SaveChangesAsync();

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);

        var actorName = User.Identity?.Name ?? "Utilisateur";
        var actorRole = User.IsInRole("Admin") ? "Admin" : "RH";

        await _notificationService.NotifyAsync(
            dto.EmployeeId,
            "Contrat cree",
            $"Un contrat de type {dto.ContractType} a ete cree pour {employee?.FirstName} {employee?.LastName} par {actorRole} {actorName}.",
            NotificationType.ContractCreated
        );

        return Ok(new
        {
            contract.Id,
            contract.EmployeeId,
            contract.ContractType,
            contract.StartDate,
            contract.EndDate,
            contract.BaseSalary,
            contract.Status
        });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateContractDto dto)
    {
        var contract = await _context.Contracts.FirstOrDefaultAsync(x => x.Id == id);
        if (contract == null)
            return NotFound(new { message = "Contrat introuvable." });

        var employeeExists = await _context.Employees.AnyAsync(x => x.Id == dto.EmployeeId);
        if (!employeeExists)
            return BadRequest(new { message = "Employe introuvable." });

        if (string.IsNullOrWhiteSpace(dto.ContractType))
            return BadRequest(new { message = "Le type de contrat est obligatoire." });

        if (dto.BaseSalary <= 0)
            return BadRequest(new { message = "Le salaire de base doit etre superieur a 0." });

        contract.EmployeeId = dto.EmployeeId;
        contract.ContractType = dto.ContractType.Trim();
        contract.StartDate = dto.StartDate;
        contract.EndDate = dto.EndDate;
        contract.BaseSalary = dto.BaseSalary;
        contract.Status = dto.Status;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Contrat modifie avec succes.",
            contract.Id,
            contract.EmployeeId,
            contract.ContractType,
            contract.StartDate,
            contract.EndDate,
            contract.BaseSalary,
            contract.Status
        });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var contract = await _context.Contracts.FirstOrDefaultAsync(x => x.Id == id);
        if (contract == null)
            return NotFound(new { message = "Contrat introuvable." });

        _context.Contracts.Remove(contract);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Contrat supprime avec succes." });
    }
}