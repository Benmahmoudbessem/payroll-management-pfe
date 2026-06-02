import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionsService } from '../../core/services/predictions.service';
import { SalaryMassPrediction } from '../../models/prediction.models';

@Component({
  selector: 'app-predictions-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
    }

    .page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .hero {
      padding: 24px;
      border-radius: 20px;
      background: linear-gradient(135deg, #14532d, #16a34a, #22c55e);
      color: white;
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: 28px;
    }

    .hero p {
      margin: 0;
      opacity: .95;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, .06);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .stat {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 8px 20px rgba(15, 23, 42, .05);
    }

    .stat-label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .form-group input {
      border: 1px solid #d1d5db;
      border-radius: 12px;
      padding: 12px;
    }

    .btn {
      border: none;
      background: #16a34a;
      color: white;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn:disabled {
      opacity: .6;
      cursor: not-allowed;
    }

    .alert-success {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .alert-error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .chart {
      display: flex;
      align-items: end;
      gap: 12px;
      height: 260px;
      padding-top: 20px;
    }

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .bar {
      width: 50px;
      max-width: 100%;
      background: linear-gradient(180deg, #4ade80, #16a34a);
      border-radius: 12px 12px 4px 4px;
      min-height: 8px;
    }

    .bar-label {
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }

    .bar-value {
      font-size: 12px;
      font-weight: 700;
      color: #111827;
    }

    .table-wrapper {
      overflow-x: auto;
      border: 1px solid #eef2f7;
      border-radius: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      background: #f8fafc;
      text-align: left;
      padding: 14px;
      font-size: 13px;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }

    @media (max-width: 900px) {
      .grid,
      .stats,
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <section class="page">
      <div class="hero">
        <h1>Prédictions de masse salariale</h1>
        <p>Nouvelle version avec graphique intégré.</p>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Historique</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Dernière période</div>
          <div class="stat-value">{{ latest ? (latest.month + '/' + latest.year) : '---' }}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Dernière masse prédite</div>
          <div class="stat-value">{{ latest ? latest.predictedSalaryMass : 0 }}</div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h2>Lancer une prédiction</h2>

          <div *ngIf="message" class="alert-success">{{ message }}</div>
          <div *ngIf="errorMessage" class="alert-error">{{ errorMessage }}</div>

          <div class="form-row">
            <div class="form-group">
              <label>Mois</label>
              <input type="number" [(ngModel)]="month" min="1" max="12">
            </div>

            <div class="form-group">
              <label>Année</label>
              <input type="number" [(ngModel)]="year">
            </div>
          </div>

          <button class="btn" (click)="predict()" [disabled]="loading">
            {{ loading ? 'Chargement...' : 'Prédire' }}
          </button>
        </div>

        <div class="card">
          <h2>Graphique</h2>

          <div *ngIf="chartItems.length > 0; else noChart" class="chart">
            <div class="bar-item" *ngFor="let item of chartItems">
              <div class="bar-value">{{ item.value }}</div>
              <div class="bar" [style.height.px]="item.height"></div>
              <div class="bar-label">{{ item.label }}</div>
            </div>
          </div>

          <ng-template #noChart>
            <p>Aucune donnée pour le graphique.</p>
          </ng-template>
        </div>
      </div>

      <div class="card">
        <h2>Historique des prédictions</h2>

        <div class="table-wrapper" *ngIf="items.length > 0; else noData">
          <table>
            <thead>
              <tr>
                <th>Période</th>
                <th>Masse salariale prédite</th>
                <th>Évolution</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of items">
                <td>{{ p.month }}/{{ p.year }}</td>
                <td>{{ p.predictedSalaryMass }}</td>
                <td>{{ p.evolutionRate }} %</td>
                <td>{{ p.predictionDate | date:'yyyy-MM-dd HH:mm' }}</td>
                <td>{{ p.notes }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #noData>
          <p>Aucune prédiction enregistrée.</p>
        </ng-template>
      </div>
    </section>
  `
})
export class PredictionsPageComponent {
  private readonly service = inject(PredictionsService);

  items: SalaryMassPrediction[] = [];
  latest: SalaryMassPrediction | null = null;

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  loading = false;
  message = '';
  errorMessage = '';

  constructor() {
    this.load();
  }

  get chartItems() {
    const source = [...this.items].slice(0, 6).reverse();
    const max = Math.max(...source.map(x => x.predictedSalaryMass), 1);

    return source.map(x => ({
      label: `${x.month}/${x.year}`,
      value: x.predictedSalaryMass,
      height: Math.max((x.predictedSalaryMass / max) * 180, 10)
    }));
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.latest = data.length > 0 ? data[0] : null;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les prédictions.';
      }
    });
  }

  predict(): void {
    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.service.predict(this.month, this.year).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Prédiction générée avec succès.';
        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Impossible de générer la prédiction.';
      }
    });
  }
}