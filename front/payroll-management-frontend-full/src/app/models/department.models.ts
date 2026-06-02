export interface Department {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
}

export interface DepartmentCreateRequest {
  name: string;
  description?: string | null;
}
