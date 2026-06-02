export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  expiresAt: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface CurrentUserDto {
  id: string;
  fullName: string;
  email: string;
  employeeId?: string | null;
  roles: string[];
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  role: string;
  employeeId?: string | null;
}
