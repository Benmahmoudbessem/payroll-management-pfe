import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Anomaly } from '../../models/anomaly.models';

@Injectable({ providedIn: 'root' })
export class AnomaliesService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Anomaly[]> {
    return this.http.get<Anomaly[]>(`${API_BASE_URL}/anomalies`);
  }

  getByEmployee(employeeId: string): Observable<Anomaly[]> {
    return this.http.get<Anomaly[]>(`${API_BASE_URL}/anomalies/employee/${employeeId}`);
  }
}