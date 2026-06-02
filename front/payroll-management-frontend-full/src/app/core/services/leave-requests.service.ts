import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { CreateLeaveRequestDto, LeaveRequest } from '../../models/leave.models';

@Injectable({ providedIn: 'root' })
export class LeaveRequestsService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${API_BASE_URL}/leaverequests`);
  }

  getMine(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${API_BASE_URL}/leaverequests/mine`);
  }

  getByEmployee(employeeId: string): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${API_BASE_URL}/leaverequests/employee/${employeeId}`);
  }

  create(payload: CreateLeaveRequestDto): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${API_BASE_URL}/leaverequests`, payload);
  }

  approve(id: string): Observable<any> {
    return this.http.put(`${API_BASE_URL}/leaverequests/${id}/approve`, {});
  }

  reject(id: string): Observable<any> {
    return this.http.put(`${API_BASE_URL}/leaverequests/${id}/reject`, {});
  }
}