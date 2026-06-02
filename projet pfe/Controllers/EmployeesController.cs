using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.DTOs.Employees;
using PayrollManagementBackend.Models;
using PayrollManagementBackend.Common;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmployeesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _context.Employees
            .Include(x => x.Department)
            .OrderBy(x => x.LastName)
            .ThenBy(x => x.FirstName)
            .Select(x => new
            {
                x.Id,
                x.Matricule,
                x.FirstName,
                x.LastName,
                x.DateOfBirth,
                x.CIN,
                x.Address,
                x.Phone,
                x.Email,
                x.Position,
                x.HireDate,
                x.BaseSalary,
                x.DepartmentId,
                Department = x.Department == null ? null : new
                {
                    x.Department.Id,
                    x.Department.Name,
                    x.Department.Description
                }
            })
            .ToListAsync();

        return Ok(employees);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var employee = await _context.Employees
            .Include(x => x.Department)
            .Include(x => x.Contracts)
            .Include(x => x.LeaveRequests)
            .Include(x => x.Payrolls)
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.Matricule,
                x.FirstName,
                x.LastName,
                x.DateOfBirth,
                x.CIN,
                x.Address,
                x.Phone,
                x.Email,
                x.Position,
                x.HireDate,
                x.BaseSalary,
                x.DepartmentId,
                Department = x.Department == null ? null : new
                {
                    x.Department.Id,
                    x.Department.Name,
                    x.Department.Description
                }
            })
            .FirstOrDefaultAsync();

        return employee is null ? NotFound() : Ok(employee);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Create(EmployeeCreateDto dto)
    {
        var employee = new Employee
        {
            Matricule = dto.Matricule,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DateOfBirth = dto.DateOfBirth,
            CIN = dto.CIN,
            Address = dto.Address,
            Phone = dto.Phone,
            Email = dto.Email,
            Position = dto.Position,
            HireDate = dto.HireDate,
            BaseSalary = dto.BaseSalary,
            DepartmentId = dto.DepartmentId
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Update(Guid id, EmployeeUpdateDto dto)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee is null) return NotFound();

        employee.Matricule = dto.Matricule;
        employee.FirstName = dto.FirstName;
        employee.LastName = dto.LastName;
        employee.DateOfBirth = dto.DateOfBirth;
        employee.CIN = dto.CIN;
        employee.Address = dto.Address;
        employee.Phone = dto.Phone;
        employee.Email = dto.Email;
        employee.Position = dto.Position;
        employee.HireDate = dto.HireDate;
        employee.BaseSalary = dto.BaseSalary;
        employee.DepartmentId = dto.DepartmentId;

        await _context.SaveChangesAsync();
        return Ok(employee);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee is null) return NotFound();

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
