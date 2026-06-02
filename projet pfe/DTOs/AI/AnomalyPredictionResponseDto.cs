namespace PayrollManagementBackend.DTOs.AI;

public class AnomalyPredictionResponseDto
{
    public bool IsAnomaly { get; set; }
    public decimal Score { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}