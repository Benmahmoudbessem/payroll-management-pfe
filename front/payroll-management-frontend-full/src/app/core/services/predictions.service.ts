import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SalaryMassPrediction } from '../../models/prediction.models';

@Injectable({ providedIn: 'root' })
export class PredictionsService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<SalaryMassPrediction[]> {
    return this.http.get<SalaryMassPrediction[]>(`${API_BASE_URL}/predictions`);
  }

  predict(month: number, year: number): Observable<SalaryMassPrediction> {
    return this.http.get<SalaryMassPrediction>(
      `${API_BASE_URL}/payrolls/prediction?month=${month}&year=${year}`
    );
  }
}