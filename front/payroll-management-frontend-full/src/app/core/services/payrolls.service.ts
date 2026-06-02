import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { CreatePayrollDto, Payroll } from '../../models/payroll.models';

@Injectable({ providedIn: 'root' })
export class PayrollsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/payrolls`;

  getAll(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(this.apiUrl);
  }

  getMine(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/mine`);
  }

  getById(id: string): Observable<Payroll> {
    return this.http.get<Payroll>(`${this.apiUrl}/${id}`);
  }

  getByEmployee(employeeId: string): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  create(payload: CreatePayrollDto): Observable<Payroll> {
    return this.http.post<Payroll>(this.apiUrl, payload);
  }

  update(id: string, payload: CreatePayrollDto): Observable<Payroll> {
    return this.http.put<Payroll>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}