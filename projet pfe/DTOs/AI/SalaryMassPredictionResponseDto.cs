namespace PayrollManagementBackend.DTOs.AI;

public class SalaryMassPredictionResponseDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal PredictedSalaryMass { get; set; }
    public decimal EvolutionRate { get; set; }
    public string Notes { get; set; } = string.Empty;
}