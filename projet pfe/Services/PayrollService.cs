using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.DTOs.Payroll;
using PayrollManagementBackend.Data;
using PayrollManagementBackend.Models;
using PayrollManagementBackend.DTOs.AI;

namespace PayrollManagementBackend.Services;

public class PayrollService : IPayrollService
{
    private readonly AppDbContext _context;
    private readonly IAiService _aiService;

    public PayrollService(AppDbContext context, IAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task<Payroll> CreatePayrollAsync(CreatePayrollDto dto)
    {
        var employee = await _context.Employees.FindAsync(dto.EmployeeId)
            ?? throw new InvalidOperationException("Employee not found.");

        var alreadyExists = await _context.Payrolls.AnyAsync(x =>
            x.EmployeeId == dto.EmployeeId && x.Month == dto.Month && x.Year == dto.Year);

        if (alreadyExists)
            throw new InvalidOperationException("Payroll already exists for this employee and period.");

        var gross = employee.BaseSalary + dto.Bonus + dto.Allowance + dto.OvertimeAmount;
        var net = gross - dto.Deductions - dto.Contributions;

        var payroll = new Payroll
        {
            EmployeeId = employee.Id,
            Month = dto.Month,
            Year = dto.Year,
            BaseSalary = employee.BaseSalary,
            Bonus = dto.Bonus,
            Allowance = dto.Allowance,
            OvertimeAmount = dto.OvertimeAmount,
            Deductions = dto.Deductions,
            Contributions = dto.Contributions,
            GrossSalary = gross,
            NetSalary = net
        };

        _context.Payrolls.Add(payroll);
        await _context.SaveChangesAsync();

        _context.Payslips.Add(new Payslip
        {
            PayrollId = payroll.Id,
            FilePath = $"payslips/{employee.Matricule}_{dto.Month}_{dto.Year}.pdf"
        });

        _context.PayrollHistories.Add(new PayrollHistory
        {
            PayrollId = payroll.Id,
            Action = "CREATE",
            OldValue = "-",
            NewValue = $"NetSalary: {net}"
        });

        _context.Notifications.Add(new Notification
        {
            EmployeeId = employee.Id,
            Title = "Paie générée",
            Message = $"Votre paie du {dto.Month}/{dto.Year} a été générée."
        });

        await _context.SaveChangesAsync();

        // ===== Appel du service IA Python =====
        var aiInput = new PayrollAiInputDto
        {
            PayrollId = payroll.Id,
            EmployeeId = payroll.EmployeeId,
            BaseSalary = payroll.BaseSalary,
            Bonus = payroll.Bonus,
            Allowance = payroll.Allowance,
            OvertimeAmount = payroll.OvertimeAmount,
            Deductions = payroll.Deductions,
            Contributions = payroll.Contributions,
            GrossSalary = payroll.GrossSalary,
            NetSalary = payroll.NetSalary,
            Month = payroll.Month,
            Year = payroll.Year
        };

        bool anomalyDetected = false;
        string anomalyType = "Normal";
        string anomalyDescription = "Aucune anomalie détectée.";
        decimal anomalyScore = 0m;

        // ===== Appel IA sécurisé =====
        try
        {
            Console.WriteLine("=== AVANT APPEL IA ===");

            var aiResult = await _aiService.PredictAnomalyAsync(aiInput);

            Console.WriteLine("=== APRES APPEL IA ===");

            if (aiResult is not null && aiResult.IsAnomaly)
            {
                anomalyDetected = true;
                anomalyType = aiResult.Type ?? "Anomalie IA";
                anomalyDescription = aiResult.Description ?? "Anomalie détectée par le service IA.";
                anomalyScore = aiResult.Score;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("=== ERREUR APPEL IA ===");
            Console.WriteLine(ex.Message);

            // Important : on ne bloque pas la création de la paie
            // Les règles métier locales vont continuer après
        }

        // 2. Règles métier renforcées
        if (payroll.Bonus >= 500)
        {
            anomalyDetected = true;
            anomalyType = "Prime inhabituelle";
            anomalyDescription = "Le montant de la prime est anormalement élevé.";
            anomalyScore = 0.90m;
        }

        if (payroll.Bonus > payroll.BaseSalary * 0.40m)
        {
            anomalyDetected = true;
            anomalyType = "Prime élevée";
            anomalyDescription = "La prime dépasse 40% du salaire de base.";
            anomalyScore = 0.92m;
        }

        if (payroll.Allowance > payroll.BaseSalary * 0.25m)
        {
            anomalyDetected = true;
            anomalyType = "Indemnité élevée";
            anomalyDescription = "L'indemnité dépasse 25% du salaire de base.";
            anomalyScore = 0.88m;
        }

        if (payroll.OvertimeAmount >= 200)
        {
            anomalyDetected = true;
            anomalyType = "Heures supplémentaires élevées";
            anomalyDescription = "Le montant des heures supplémentaires est inhabituellement élevé.";
            anomalyScore = 0.87m;
        }

        if (payroll.OvertimeAmount > payroll.BaseSalary * 0.20m)
        {
            anomalyDetected = true;
            anomalyType = "Heures supplémentaires élevées";
            anomalyDescription = "Les heures supplémentaires dépassent 20% du salaire de base.";
            anomalyScore = 0.89m;
        }

        if (payroll.Deductions < 0 || payroll.Contributions < 0)
        {
            anomalyDetected = true;
            anomalyType = "Valeurs invalides";
            anomalyDescription = "Les retenues ou cotisations sont invalides.";
            anomalyScore = 0.95m;
        }

        if (payroll.NetSalary > payroll.GrossSalary)
        {
            anomalyDetected = true;
            anomalyType = "Salaire incohérent";
            anomalyDescription = "Le salaire net dépasse le salaire brut.";
            anomalyScore = 0.98m;
        }

        if (gross > employee.BaseSalary * 2)
        {
            anomalyDetected = true;
            anomalyType = "Salaire brut inhabituel";
            anomalyDescription = "Le salaire brut dépasse 2 fois le salaire de base.";
            anomalyScore = 0.93m;
        }

        if (anomalyDetected)
        {
            _context.Anomalies.Add(new Anomaly
            {
                PayrollId = payroll.Id,
                AnomalyType = anomalyType,
                Description = anomalyDescription,
                Score = anomalyScore,
                Status = "Detected",
                DetectedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });

            _context.Notifications.Add(new Notification
            {
                EmployeeId = employee.Id,
                Title = "Anomalie détectée",
                Message = $"Une anomalie a été détectée dans votre paie du {dto.Month}/{dto.Year}."
            });

            await _context.SaveChangesAsync();
        }

    return await _context.Payrolls
    .Include(x => x.Employee)
    .Include(x => x.Payslip)
    .Include(x => x.Anomalies)
    .FirstAsync(x => x.Id == payroll.Id);
    }

    public async Task<IEnumerable<Payroll>> GetAllAsync()
    {
        return await _context.Payrolls
            .Include(x => x.Employee)
            .Include(x => x.Payslip)
            .Include(x => x.Anomalies)
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Month)
            .ToListAsync();
    }

    public async Task<SalaryMassPrediction> PredictSalaryMassAsync(int month, int year)
    {
        var aiResult = await _aiService.PredictSalaryMassAsync(month, year);

        if (aiResult is null)
            throw new InvalidOperationException("AI service prediction failed.");

        var prediction = new SalaryMassPrediction
        {
            Month = aiResult.Month,
            Year = aiResult.Year,
            PredictedSalaryMass = aiResult.PredictedSalaryMass,
            EvolutionRate = aiResult.EvolutionRate,
            Notes = aiResult.Notes
        };

        _context.SalaryMassPredictions.Add(prediction);
        await _context.SaveChangesAsync();

        return prediction;
    }
}