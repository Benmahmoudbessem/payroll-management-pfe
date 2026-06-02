export interface Contract {
  id: string;
  employeeId: string;
  contractType: string;
  startDate: string;
  endDate?: string | null;
  baseSalary: number;
  status: string;
  employee?: { id: string; firstName: string; lastName: string; matricule: string } | null;
}

export interface CreateContractDto {
  employeeId: string;
  contractType: string;
  startDate: string;
  endDate?: string | null;
  baseSalary: number;
  status: string;
}
