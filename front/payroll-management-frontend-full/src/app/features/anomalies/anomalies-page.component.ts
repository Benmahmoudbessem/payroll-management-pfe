import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnomaliesService } from '../../core/services/anomalies.service';
import { Anomaly } from '../../models/anomaly.models';

@Component({
  selector: 'app-anomalies-page',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }

    .anomalies-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
      padding: 28px;
      border-radius: 22px;
      background: linear-gradient(135deg, #7f1d1d, #b91c1c, #ef4444);
      color: white;
      box-shadow: 0 18px 40px rgba(239, 68, 68, 0.22);
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: 30px;
      font-weight: 700;
    }

    .hero p {
      margin: 0;
      line-height: 1.6;
      max-width: 700px;
      opacity: .95;
    }

    .hero-badge {
      padding: 10px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,.16);
      border: 1px solid rgba(255,255,255,.18);
      font-weight: 600;
    }

    .alert {
      border-radius: 14px;
      padding: 14px 16px;
      font-size: 14px;
    }

    .alert-error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
    }

    .stat-label {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
    }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 22px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .table-wrapper {
      overflow-x: auto;
      border: 1px solid #eef2f7;
      border-radius: 18px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    thead th {
      background: #f8fafc;
      color: #374151;
      font-size: 13px;
      font-weight: 700;
      text-align: left;
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody td {
      padding: 15px 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
      color: #111827;
      vertical-align: top;
    }

    tbody tr:hover {
      background: #fffafa;
    }

    .employee-name {
      font-weight: 700;
    }

    .employee-meta {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: #fef2f2;
      color: #b91c1c;
      font-size: 12px;
      font-weight: 700;
    }

    .score {
      font-weight: 700;
      color: #b91c1c;
    }

    .empty-state {
      text-align: center;
      padding: 28px;
      color: #6b7280;
    }

    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <section class="anomalies-page">
      <div class="hero">
        <div>
          <h1>Anomalies de paie</h1>
          <p>
            Visualise les anomalies détectées par le système intelligent
            à partir des règles métier et du module IA.
          </p>
        </div>
        <div class="hero-badge">Détection intelligente</div>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total anomalies</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Anomalies détectées</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Dernière mise à jour</div>
          <div class="stat-value">{{ items.length > 0 ? 'OK' : '---' }}</div>
        </div>
      </div>

      <div class="card">
        <h2 style="margin-top:0">Liste des anomalies</h2>

        <div class="table-wrapper" *ngIf="items.length > 0; else emptyTpl">
          <table>
            <thead>
              <tr>
                <th>Employé</th>
                <th>Type</th>
                <th>Description</th>
                <th>Score</th>
                <th>Période</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of items">
                <td>
                  <div class="employee-name">
                    {{ a.payroll?.employee?.firstName || '-' }}
                    {{ a.payroll?.employee?.lastName || '' }}
                  </div>
                  <div class="employee-meta">
                    {{ a.payroll?.employee?.matricule || 'Aucun matricule' }}
                  </div>
                </td>
                <td><span class="badge">{{ a.anomalyType }}</span></td>
                <td>{{ a.description }}</td>
                <td class="score">{{ a.score }}</td>
                <td>{{ a.payroll?.month }}/{{ a.payroll?.year }}</td>
                <td>{{ a.detectedAt | date:'yyyy-MM-dd HH:mm' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyTpl>
          <div class="empty-state">
            Aucune anomalie détectée pour le moment.
          </div>
        </ng-template>
      </div>
    </section>
  `
})
export class AnomaliesPageComponent {
  private readonly service = inject(AnomaliesService);

  items: Anomaly[] = [];
  errorMessage = '';

  constructor() {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.items = data,
      error: () => this.errorMessage = 'Impossible de charger les anomalies.'
    });
  }
}