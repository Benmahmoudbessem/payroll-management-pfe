using PayrollManagementBackend.DTOs.Payroll;
using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Services;

public interface IPayrollService
{
    Task<Payroll> CreatePayrollAsync(CreatePayrollDto dto);
    Task<IEnumerable<Payroll>> GetAllAsync();
    Task<SalaryMassPrediction> PredictSalaryMassAsync(int month, int year);
}
