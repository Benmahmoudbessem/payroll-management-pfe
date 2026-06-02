namespace PayrollManagementBackend.Models;

public class SalaryMassPrediction : BaseEntity
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal PredictedSalaryMass { get; set; }
    public decimal EvolutionRate { get; set; }
    public DateTime PredictionDate { get; set; } = DateTime.UtcNow;
    public string Notes { get; set; } = string.Empty;
}
