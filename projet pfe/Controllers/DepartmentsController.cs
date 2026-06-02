using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.Models;
using PayrollManagementBackend.Common;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Description,
                x.CreatedAt
            })
            .ToListAsync();

        return Ok(departments);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var department = await _context.Departments
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Description,
                x.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return NotFound(new { message = "Département introuvable." });
        }

        return Ok(department);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Create([FromBody] Department department)
    {
        if (department == null)
        {
            return BadRequest(new { message = "Données invalides." });
        }

        if (string.IsNullOrWhiteSpace(department.Name))
        {
            return BadRequest(new { message = "Le nom du département est obligatoire." });
        }

        var exists = await _context.Departments
            .AnyAsync(x => x.Name.ToLower() == department.Name.Trim().ToLower());

        if (exists)
        {
            return BadRequest(new { message = "Un département avec ce nom existe déjà." });
        }

        department.Name = department.Name.Trim();
        department.Description = department.Description?.Trim();

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = department.Id }, new
        {
            department.Id,
            department.Name,
            department.Description,
            department.CreatedAt
        });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Department model)
    {
        if (model == null)
        {
            return BadRequest(new { message = "Données invalides." });
        }

        if (string.IsNullOrWhiteSpace(model.Name))
        {
            return BadRequest(new { message = "Le nom du département est obligatoire." });
        }

        var department = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id);
        if (department == null)
        {
            return NotFound(new { message = "Département introuvable." });
        }

        var exists = await _context.Departments
            .AnyAsync(x => x.Id != id && x.Name.ToLower() == model.Name.Trim().ToLower());

        if (exists)
        {
            return BadRequest(new { message = "Un autre département avec ce nom existe déjà." });
        }

        department.Name = model.Name.Trim();
        department.Description = model.Description?.Trim();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Département modifié avec succès.",
            department.Id,
            department.Name,
            department.Description,
            department.CreatedAt
        });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,RH")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(x => x.Id == id);
        if (department == null)
        {
            return NotFound(new { message = "Département introuvable." });
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Département supprimé avec succès." });
    }
}