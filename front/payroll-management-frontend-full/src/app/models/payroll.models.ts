export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  allowance: number;
  overtimeAmount: number;
  deductions: number;
  contributions: number;
  grossSalary: number;
  netSalary: number;
  generatedAt: string;
  validationStatus: number | string;
  employee?: { id: string; firstName: string; lastName: string; matricule: string } | null;
}

export interface CreatePayrollDto {
  employeeId: string;
  month: number;
  year: number;
  bonus: number;
  allowance: number;
  overtimeAmount: number;
  deductions: number;
  contributions: number;
}
