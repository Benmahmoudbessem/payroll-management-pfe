export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  requestDate?: string;
  employee?: any;
}

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}
