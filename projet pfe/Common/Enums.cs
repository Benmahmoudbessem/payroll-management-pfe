namespace PayrollManagementBackend.Common;

public enum LeaveRequestStatus
{
    Pending,
    Approved,
    Rejected
}

public enum PayrollValidationStatus
{
    Draft,
    Validated,
    Rejected
}

public enum NotificationType
{
    PayrollGenerated,
    PayrollAnomaly,
    LeaveApproved,
    LeaveRejected,
    ContractCreated
}
