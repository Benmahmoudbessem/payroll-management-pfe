using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PayrollManagementBackend.Models;

namespace PayrollManagementBackend.Data;

public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<Leave> Leaves => Set<Leave>();
    public DbSet<Payroll> Payrolls => Set<Payroll>();
    public DbSet<Payslip> Payslips => Set<Payslip>();
    public DbSet<PayrollHistory> PayrollHistories => Set<PayrollHistory>();
    public DbSet<Anomaly> Anomalies => Set<Anomaly>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<SalaryMassPrediction> SalaryMassPredictions => Set<SalaryMassPrediction>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Employee>()
            .HasIndex(x => x.Matricule)
            .IsUnique();

        builder.Entity<Employee>()
            .HasIndex(x => x.CIN)
            .IsUnique();

        builder.Entity<AppUser>()
            .HasOne(x => x.Employee)
            .WithMany()
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Payroll>()
            .HasIndex(x => new { x.EmployeeId, x.Month, x.Year })
            .IsUnique();

        builder.Entity<Payslip>()
            .HasOne(x => x.Payroll)
            .WithOne(x => x.Payslip)
            .HasForeignKey<Payslip>(x => x.PayrollId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
