export interface EmployeeCreateDto {
  matricule: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  cin: string;
  address: string;
  phone: string;
  email: string;
  position: string;
  hireDate: string;
  baseSalary: number;
  departmentId: string;
}

export interface Employee {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  cin: string;
  address: string;
  phone: string;
  email: string;
  position: string;
  hireDate: string;
  baseSalary: number;
  departmentId: string;
  department?: { id: string; name: string; description?: string | null } | null;
}
