using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Services;

public interface IAnomalyService
{
    Task<List<Anomaly>> DetectForPayrollAsync(Guid payrollId);
}
