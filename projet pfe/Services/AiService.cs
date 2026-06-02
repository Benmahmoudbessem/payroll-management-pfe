using System.Net.Http.Json;
using PayrollManagementBackend.DTOs.AI;

namespace PayrollManagementBackend.Services;

public class AiService : IAiService
{
    private readonly HttpClient _httpClient;

    public AiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<AnomalyPredictionResponseDto?> PredictAnomalyAsync(PayrollAiInputDto input)
    {
        var response = await _httpClient.PostAsJsonAsync("predict-anomaly", input);

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<AnomalyPredictionResponseDto>();
    }

    public async Task<SalaryMassPredictionResponseDto?> PredictSalaryMassAsync(int month, int year)
    {
        var response = await _httpClient.GetAsync($"predict-salary-mass?month={month}&year={year}");

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<SalaryMassPredictionResponseDto>();
    }
}