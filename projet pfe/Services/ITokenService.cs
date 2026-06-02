using PayrollManagementBackend.DTOs.Auth;
using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Services;

public interface ITokenService
{
    Task<AuthResponseDto> CreateTokenAsync(AppUser user);
}
