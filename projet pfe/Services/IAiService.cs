using PayrollManagementBackend.DTOs.AI;

namespace PayrollManagementBackend.Services;

public interface IAiService
{
    Task<AnomalyPredictionResponseDto?> PredictAnomalyAsync(PayrollAiInputDto input);
    Task<SalaryMassPredictionResponseDto?> PredictSalaryMassAsync(int month, int year);
}