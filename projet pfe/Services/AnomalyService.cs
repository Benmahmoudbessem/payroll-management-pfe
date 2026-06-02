using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Services;

public class AnomalyService : IAnomalyService
{
    private readonly AppDbContext _context;

    public AnomalyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Anomaly>> DetectForPayrollAsync(Guid payrollId)
    {
        var payroll = await _context.Payrolls
            .Include(x => x.Employee)
            .FirstOrDefaultAsync(x => x.Id == payrollId)
            ?? throw new InvalidOperationException("Payroll not found.");

        var previousPayrolls = await _context.Payrolls
            .Where(x => x.EmployeeId == payroll.EmployeeId && x.Id != payrollId)
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Month)
            .Take(6)
            .ToListAsync();

        var anomalies = new List<Anomaly>();

        if (payroll.Bonus > payroll.BaseSalary * 0.5m)
        {
            anomalies.Add(new Anomaly
            {
                PayrollId = payroll.Id,
                AnomalyType = "Prime élevée",
                Description = "La prime dépasse 50% du salaire de base.",
                Score = 0.80m
            });
        }

        if (payroll.Deductions > payroll.BaseSalary * 0.4m)
        {
            anomalies.Add(new Anomaly
            {
                PayrollId = payroll.Id,
                AnomalyType = "Retenues anormales",
                Description = "Les retenues dépassent 40% du salaire de base.",
                Score = 0.75m
            });
        }

        if (previousPayrolls.Any())
        {
            var avgNet = previousPayrolls.Average(x => x.NetSalary);
            if (avgNet > 0)
            {
                var variation = Math.Abs((payroll.NetSalary - avgNet) / avgNet);
                if (variation > 0.30m)
                {
                    anomalies.Add(new Anomaly
                    {
                        PayrollId = payroll.Id,
                        AnomalyType = "Variation inhabituelle",
                        Description = "Le salaire net varie de plus de 30% par rapport à la moyenne des 6 derniers mois.",
                        Score = decimal.Round(variation, 2)
                    });
                }
            }
        }

        if (payroll.OvertimeAmount > payroll.BaseSalary * 0.3m)
        {
            anomalies.Add(new Anomaly
            {
                PayrollId = payroll.Id,
                AnomalyType = "Heures supplémentaires élevées",
                Description = "Le montant des heures supplémentaires semble inhabituel.",
                Score = 0.70m
            });
        }
        _context.Anomalies.AddRange(anomalies);
        await _context.SaveChangesAsync();
        return anomalies;
    }
}
