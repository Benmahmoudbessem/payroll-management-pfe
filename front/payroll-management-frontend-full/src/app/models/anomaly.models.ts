export interface Anomaly {
  id: string;
  payrollId: string;
  anomalyType: string;
  description: string;
  score: number;
  status: string;
  detectedAt: string;
  payroll?: {
    id: string;
    month: number;
    year: number;
    netSalary: number;
    employee?: {
      id: string;
      firstName: string;
      lastName: string;
      matricule: string;
    } | null;
  } | null;
}