namespace PayrollManagementBackend.Models;

public class Employee : BaseEntity
{
    public string Matricule { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string CIN { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
    public decimal BaseSalary { get; set; }

    public Guid DepartmentId { get; set; }
    public Department? Department { get; set; }

    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    public ICollection<Leave> Leaves { get; set; } = new List<Leave>();
    public ICollection<Payroll> Payrolls { get; set; } = new List<Payroll>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
