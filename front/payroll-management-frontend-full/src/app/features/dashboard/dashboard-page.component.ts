import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DepartmentService } from '../../core/services/department.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ContractsService } from '../../core/services/contracts.service';
import { LeaveRequestsService } from '../../core/services/leave-requests.service';
import { PayrollsService } from '../../core/services/payrolls.service';
import { PredictionsService } from '../../core/services/predictions.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { AnomaliesService } from '../../core/services/anomalies.service';
import { Anomaly } from '../../models/anomaly.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
    }

    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      flex-wrap: wrap;
      padding: 28px;
      border-radius: 24px;
      background: linear-gradient(135deg, #0f172a, #1d4ed8, #2563eb);
      color: white;
      box-shadow: 0 20px 45px rgba(37, 99, 235, 0.24);
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: 30px;
      font-weight: 700;
    }

    .hero p {
      margin: 0;
      max-width: 720px;
      line-height: 1.6;
      opacity: 0.95;
    }

    .hero-badge {
      padding: 10px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.16);
      font-weight: 600;
      white-space: nowrap;
    }

    .alert {
      border-radius: 14px;
      padding: 14px 16px;
      font-size: 14px;
      border: 1px solid transparent;
    }

    .alert-error {
      background: #fef2f2;
      color: #b91c1c;
      border-color: #fecaca;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
    }

    .stats-grid.employee {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
      position: relative;
      overflow: hidden;
    }

    .stat-card::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 70px;
      height: 70px;
      border-radius: 0 0 0 100%;
      background: rgba(37, 99, 235, 0.06);
    }

    .stat-card.ia::after {
      background: rgba(239, 68, 68, 0.08);
    }

    .stat-label {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 30px;
      font-weight: 700;
      color: #111827;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      align-items: start;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 22px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .card-title {
      margin: 0 0 6px;
      font-size: 21px;
      font-weight: 700;
      color: #111827;
    }

    .card-subtitle {
      margin: 0 0 18px;
      color: #6b7280;
      font-size: 14px;
    }

    .mini-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .mini-item {
      padding: 14px;
      border: 1px solid #eef2f7;
      border-radius: 16px;
      background: #fafcff;
    }

    .mini-item-title {
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }

    .mini-item-text {
      color: #6b7280;
      font-size: 13px;
      line-height: 1.5;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: #eef2ff;
      color: #3730a3;
      font-size: 12px;
      font-weight: 700;
      margin-top: 8px;
    }

    .badge-danger {
      background: #fef2f2;
      color: #b91c1c;
    }

    .badge-success {
      background: #f0fdf4;
      color: #166534;
    }

    .chart-box {
      width: 100%;
      min-height: 260px;
    }

    .bar-chart {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
      height: 220px;
      padding: 18px 8px 0;
    }

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      min-width: 0;
      height: 100%;
    }

    .bar {
      width: 100%;
      max-width: 58px;
      min-height: 12px;
      border-radius: 14px 14px 6px 6px;
      background: linear-gradient(180deg, #60a5fa, #2563eb);
      box-shadow: 0 10px 18px rgba(37, 99, 235, 0.2);
      transition: 0.25s ease;
    }

    .bar:hover {
      transform: translateY(-2px);
    }

    .bar-label {
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      word-break: break-word;
    }

    .bar-value {
      font-size: 12px;
      font-weight: 700;
      color: #111827;
    }

    .donut-wrap {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 20px;
      align-items: center;
    }

    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid #eef2f7;
      border-radius: 14px;
      padding: 10px 12px;
      background: #fafcff;
      font-size: 14px;
    }

    .legend-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .empty-state {
      color: #6b7280;
      text-align: center;
      padding: 30px 12px;
      border: 1px dashed #dbe3ef;
      border-radius: 16px;
      background: #fafcff;
    }

    .svg-chart {
      width: 100%;
      height: 220px;
      overflow: visible;
    }

    .line-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 12px;
      color: #6b7280;
    }

    .quick-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }

    .quick-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 22px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .quick-card h3 {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }

    .quick-card p {
      margin: 0 0 16px;
      color: #6b7280;
      line-height: 1.5;
    }

    .employee-sections {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px;
    }

    .btn-primary {
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
    }

    .highlight-card {
      border: 1px solid #fecaca;
      background: linear-gradient(180deg, #fff5f5, #ffffff);
    }

    .prediction-card {
      border: 1px solid #bbf7d0;
      background: linear-gradient(180deg, #f0fdf4, #ffffff);
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 14px;
    }

    .kpi-box {
      padding: 14px;
      border-radius: 14px;
      background: white;
      border: 1px solid #eef2f7;
    }

    .kpi-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .kpi-value {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }

    @media (max-width: 1100px) {
      .content-grid,
      .charts-grid,
      .quick-grid,
      .employee-sections {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 800px) {
      .stats-grid,
      .stats-grid.employee,
      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .donut-wrap {
        grid-template-columns: 1fr;
      }

      .hero,
      .card,
      .quick-card {
        padding: 18px;
      }
    }
  `],
  template: `
    <section class="dashboard-page">
      <div class="hero">
        <div>
          <h1>Tableau de bord</h1>
          <p>
            Vue synthétique et professionnelle de la plateforme intelligente de
            gestion de la paie, avec des accès rapides selon le profil connecté.
          </p>
        </div>
        <div class="hero-badge">
          {{ isEmployee ? 'Vue Employé' : 'Vue Administration' }}
        </div>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <ng-container *ngIf="isEmployee; else adminView">
        <div class="stats-grid employee">
          <div class="stat-card">
            <div class="stat-label">Mes notifications</div>
            <div class="stat-value">{{ employeeStats.notifications }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Mes demandes de congé</div>
            <div class="stat-value">{{ employeeStats.leaveRequests }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Mes paies</div>
            <div class="stat-value">{{ employeeStats.payrolls }}</div>
          </div>
        </div>

        <div class="quick-grid">
          <div class="quick-card">
            <h3>Mon espace</h3>
            <p>Voir mon profil et mes informations personnelles.</p>
            <button class="btn-primary" (click)="goTo('/employee-space')">Ouvrir</button>
          </div>

          <div class="quick-card">
            <h3>Mes notifications</h3>
            <p>Accéder à toutes mes notifications reçues.</p>
            <button class="btn-primary" (click)="goTo('/notifications')">Voir</button>
          </div>

          <div class="quick-card">
            <h3>Mes demandes de congé</h3>
            <p>Consulter l’historique de mes demandes.</p>
            <button class="btn-primary" (click)="goTo('/leave-requests')">Consulter</button>
          </div>

          <div class="quick-card">
            <h3>Faire une demande de congé</h3>
            <p>Créer une nouvelle demande rapidement.</p>
            <button class="btn-primary" (click)="goTo('/leave-requests')">Créer</button>
          </div>

          <div class="quick-card">
            <h3>Mes fiches de paie</h3>
            <p>Afficher et télécharger mes fiches de paie.</p>
            <button class="btn-primary" (click)="goTo('/payrolls')">Voir mes paies</button>
          </div>
        </div>

        <div class="employee-sections">
          <div class="card">
            <h2 class="card-title">Dernières notifications</h2>
            <p class="card-subtitle">Aperçu rapide de mes notifications récentes.</p>

            <div *ngIf="employeeNotifications.length === 0" class="empty-state">
              Aucune notification disponible.
            </div>

            <div class="mini-list" *ngIf="employeeNotifications.length > 0">
              <div class="mini-item" *ngFor="let item of employeeNotifications.slice(0, 5)">
                <div class="mini-item-title">{{ item.title }}</div>
                <div class="mini-item-text">{{ item.message }}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="card-title">Mes demandes de congé</h2>
            <p class="card-subtitle">Dernières demandes enregistrées.</p>

            <div *ngIf="employeeLeaveRequests.length === 0" class="empty-state">
              Aucune demande de congé.
            </div>

            <div class="mini-list" *ngIf="employeeLeaveRequests.length > 0">
              <div class="mini-item" *ngFor="let item of employeeLeaveRequests.slice(0, 5)">
                <div class="mini-item-title">{{ item.leaveType }}</div>
                <div class="mini-item-text">
                  Du {{ item.startDate | date:'yyyy-MM-dd' }} au {{ item.endDate | date:'yyyy-MM-dd' }}
                </div>
                <div class="badge">{{ item.status }}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="card-title">Mes fiches de paie</h2>
            <p class="card-subtitle">Mes dernières paies disponibles.</p>

            <div *ngIf="employeePayrolls.length === 0" class="empty-state">
              Aucune fiche de paie disponible.
            </div>

            <div class="mini-list" *ngIf="employeePayrolls.length > 0">
              <div class="mini-item" *ngFor="let item of employeePayrolls.slice(0, 5)">
                <div class="mini-item-title">{{ item.month }}/{{ item.year }}</div>
                <div class="mini-item-text">
                  Salaire net : {{ item.netSalary | number:'1.2-2' }}
                </div>
                <div class="badge">{{ item.validationStatus }}</div>
              </div>
            </div>

            <div style="margin-top:14px;">
              <button class="btn-primary" (click)="goTo('/payrolls')">
                Afficher / Télécharger mes fiches
              </button>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #adminView>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Départements</div>
            <div class="stat-value">{{ adminStats.departments }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Employés</div>
            <div class="stat-value">{{ adminStats.employees }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Contrats</div>
            <div class="stat-value">{{ adminStats.contracts }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Demandes de congé</div>
            <div class="stat-value">{{ adminStats.leaveRequests }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Paies</div>
            <div class="stat-value">{{ adminStats.payrolls }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Prédictions</div>
            <div class="stat-value">{{ adminStats.predictions }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Notifications</div>
            <div class="stat-value">{{ adminStats.notifications }}</div>
          </div>
          <div class="stat-card ia">
            <div class="stat-label">Anomalies détectées</div>
            <div class="stat-value">{{ anomalyCount }}</div>
          </div>
        </div>

        <div class="quick-grid">
          <div class="quick-card prediction-card">
            <h3>Prédictions IA</h3>
            <p>Lancer et consulter les prévisions de masse salariale.</p>
            <button class="btn-primary" (click)="goTo('/predictions')">Ouvrir</button>
          </div>

          <div class="quick-card highlight-card">
            <h3>Anomalies de paie</h3>
            <p>Suivre les anomalies détectées par les règles métier et l’IA.</p>
            <button class="btn-primary btn-danger" (click)="goTo('/anomalies')">Voir les anomalies</button>
          </div>

          <div class="quick-card">
            <h3>Gestion des paies</h3>
            <p>Créer, suivre et contrôler les paies du système.</p>
            <button class="btn-primary" (click)="goTo('/payrolls')">Gérer</button>
          </div>
        </div>

        <div class="charts-grid">
          <div class="card">
            <h2 class="card-title">Vue globale des modules</h2>
            <p class="card-subtitle">Bar chart des principaux indicateurs du système.</p>

            <div class="chart-box" *ngIf="adminChartData.length > 0; else emptyAdminBars">
              <div class="bar-chart">
                <div class="bar-item" *ngFor="let item of adminChartData">
                  <div class="bar-value">{{ item.value }}</div>
                  <div class="bar" [style.height.px]="getBarHeightPx(item.value, maxAdminValue())"></div>
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>

            <ng-template #emptyAdminBars>
              <div class="empty-state">Aucune donnée disponible pour afficher le graphique.</div>
            </ng-template>
          </div>

          <div class="card">
            <h2 class="card-title">Répartition fonctionnelle</h2>
            <p class="card-subtitle">Donut chart des volumes par catégorie.</p>

            <div *ngIf="adminDonutTotal() > 0; else emptyAdminDonut" class="donut-wrap">
              <svg viewBox="0 0 42 42" style="width:180px;height:180px; transform: rotate(-90deg);">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" stroke-width="4"></circle>

                <circle
                  cx="21" cy="21" r="15.915"
                  fill="transparent"
                  stroke="#2563eb"
                  stroke-width="4"
                  [attr.stroke-dasharray]="adminDonutSegments().employees + ' ' + (100 - adminDonutSegments().employees)"
                  stroke-linecap="round">
                </circle>

                <circle
                  cx="21" cy="21" r="15.915"
                  fill="transparent"
                  stroke="#10b981"
                  stroke-width="4"
                  [attr.stroke-dasharray]="adminDonutSegments().contracts + ' ' + (100 - adminDonutSegments().contracts)"
                  [attr.stroke-dashoffset]="-adminDonutSegments().employees"
                  stroke-linecap="round">
                </circle>

                <circle
                  cx="21" cy="21" r="15.915"
                  fill="transparent"
                  stroke="#f97316"
                  stroke-width="4"
                  [attr.stroke-dasharray]="adminDonutSegments().payrolls + ' ' + (100 - adminDonutSegments().payrolls)"
                  [attr.stroke-dashoffset]="-(adminDonutSegments().employees + adminDonutSegments().contracts)"
                  stroke-linecap="round">
                </circle>

                <circle
                  cx="21" cy="21" r="15.915"
                  fill="transparent"
                  stroke="#7c3aed"
                  stroke-width="4"
                  [attr.stroke-dasharray]="adminDonutSegments().leaveRequests + ' ' + (100 - adminDonutSegments().leaveRequests)"
                  [attr.stroke-dashoffset]="-(adminDonutSegments().employees + adminDonutSegments().contracts + adminDonutSegments().payrolls)"
                  stroke-linecap="round">
                </circle>
              </svg>

              <div class="donut-legend">
                <div class="legend-item">
                  <div class="legend-left">
                    <span class="legend-dot" style="background:#2563eb"></span>
                    <span>Employés</span>
                  </div>
                  <strong>{{ adminStats.employees }}</strong>
                </div>

                <div class="legend-item">
                  <div class="legend-left">
                    <span class="legend-dot" style="background:#10b981"></span>
                    <span>Contrats</span>
                  </div>
                  <strong>{{ adminStats.contracts }}</strong>
                </div>

                <div class="legend-item">
                  <div class="legend-left">
                    <span class="legend-dot" style="background:#f97316"></span>
                    <span>Paies</span>
                  </div>
                  <strong>{{ adminStats.payrolls }}</strong>
                </div>

                <div class="legend-item">
                  <div class="legend-left">
                    <span class="legend-dot" style="background:#7c3aed"></span>
                    <span>Congés</span>
                  </div>
                  <strong>{{ adminStats.leaveRequests }}</strong>
                </div>
              </div>
            </div>

            <ng-template #emptyAdminDonut>
              <div class="empty-state">Aucune donnée disponible pour afficher le graphique.</div>
            </ng-template>
          </div>
        </div>

        <div class="content-grid">
          <div class="card">
            <h2 class="card-title">Tendance simplifiée</h2>
            <p class="card-subtitle">Courbe indicative des indicateurs principaux.</p>

            <svg class="svg-chart" viewBox="0 0 500 220" preserveAspectRatio="none">
              <line x1="30" y1="180" x2="480" y2="180" stroke="#e5e7eb" stroke-width="1"></line>
              <line x1="30" y1="20" x2="30" y2="180" stroke="#e5e7eb" stroke-width="1"></line>

              <polyline
                [attr.points]="linePoints()"
                fill="none"
                stroke="#2563eb"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round">
              </polyline>

              <circle
                *ngFor="let point of lineDots()"
                [attr.cx]="point.x"
                [attr.cy]="point.y"
                r="5"
                fill="#2563eb">
              </circle>
            </svg>

            <div class="line-labels">
              <span *ngFor="let item of lineChartLabels">{{ item }}</span>
            </div>
          </div>

          <div class="card">
            <h2 class="card-title">Résumé analytique + IA</h2>
            <p class="card-subtitle">Lecture rapide de l’activité actuelle et du module intelligent.</p>

            <div class="mini-list">
              <div class="mini-item">
                <div class="mini-item-title">Structure RH</div>
                <div class="mini-item-text">
                  {{ adminStats.employees }} employé(s) réparti(s) sur {{ adminStats.departments }} département(s).
                </div>
              </div>

              <div class="mini-item">
                <div class="mini-item-title">Couverture contractuelle</div>
                <div class="mini-item-text">
                  {{ adminStats.contracts }} contrat(s) actif(s) ou enregistrés dans le système.
                </div>
              </div>

              <div class="mini-item">
                <div class="mini-item-title">Production paie</div>
                <div class="mini-item-text">
                  {{ adminStats.payrolls }} paie(s) générée(s) avec {{ adminStats.predictions }} prédiction(s) disponibles.
                </div>
              </div>

              <div class="mini-item">
                <div class="mini-item-title">Surveillance IA</div>
                <div class="mini-item-text">
                  {{ anomalyCount }} anomalie(s) détectée(s) par le système intelligent.
                </div>
                <div class="badge badge-danger">IA + règles métier</div>
              </div>
            </div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="card highlight-card">
            <h2 class="card-title">Dernières anomalies détectées</h2>
            <p class="card-subtitle">Aperçu rapide des anomalies de paie les plus récentes.</p>

            <div *ngIf="latestAnomalies.length === 0" class="empty-state">
              Aucune anomalie enregistrée.
            </div>

            <div class="mini-list" *ngIf="latestAnomalies.length > 0">
              <div class="mini-item" *ngFor="let item of latestAnomalies">
                <div class="mini-item-title">{{ item.anomalyType }}</div>
                <div class="mini-item-text">{{ item.description }}</div>
                <div class="badge badge-danger">Score : {{ item.score }}</div>
              </div>
            </div>

            <div style="margin-top:14px;">
              <button class="btn-primary btn-danger" (click)="goTo('/anomalies')">
                Afficher toutes les anomalies
              </button>
            </div>
          </div>

          <div class="card prediction-card">
            <h2 class="card-title">Dernière prédiction IA</h2>
            <p class="card-subtitle">Dernière masse salariale prédite par le module IA.</p>

            <div *ngIf="latestPrediction; else noPrediction">
              <div class="kpi-grid">
                <div class="kpi-box">
                  <div class="kpi-label">Période</div>
                  <div class="kpi-value">{{ latestPrediction.month }}/{{ latestPrediction.year }}</div>
                </div>

                <div class="kpi-box">
                  <div class="kpi-label">Masse salariale</div>
                  <div class="kpi-value">{{ latestPrediction.predictedSalaryMass }}</div>
                </div>

                <div class="kpi-box">
                  <div class="kpi-label">Évolution</div>
                  <div class="kpi-value">{{ latestPrediction.evolutionRate }} %</div>
                </div>

                <div class="kpi-box">
                  <div class="kpi-label">Date</div>
                  <div class="kpi-value">{{ latestPrediction.predictionDate | date:'yyyy-MM-dd' }}</div>
                </div>
              </div>

              <div style="margin-top:14px;" class="mini-item">
                <div class="mini-item-title">Notes</div>
                <div class="mini-item-text">{{ latestPrediction.notes }}</div>
                <div class="badge badge-success">Prédiction IA</div>
              </div>
            </div>

            <ng-template #noPrediction>
              <div class="empty-state">Aucune prédiction enregistrée.</div>
            </ng-template>

            <div style="margin-top:14px;">
              <button class="btn-primary" (click)="goTo('/predictions')">
                Ouvrir les prédictions
              </button>
            </div>
          </div>
        </div>
      </ng-template>
    </section>
  `
})
export class DashboardPageComponent {
  private readonly auth = inject(AuthService);
  private readonly departments = inject(DepartmentService);
  private readonly employees = inject(EmployeeService);
  private readonly contracts = inject(ContractsService);
  private readonly leaves = inject(LeaveRequestsService);
  private readonly payrolls = inject(PayrollsService);
  private readonly predictions = inject(PredictionsService);
  private readonly notifications = inject(NotificationsService);
  private readonly anomalies = inject(AnomaliesService);
  private readonly router = inject(Router);

  isEmployee = false;
  errorMessage = '';

  employeeNotifications: any[] = [];
  employeeLeaveRequests: any[] = [];
  employeePayrolls: any[] = [];

  anomalyCount = 0;
  latestAnomalies: Anomaly[] = [];
  latestPrediction: any = null;

  adminStats = {
    departments: 0,
    employees: 0,
    contracts: 0,
    leaveRequests: 0,
    payrolls: 0,
    predictions: 0,
    notifications: 0
  };

  employeeStats = {
    notifications: 0,
    leaveRequests: 0,
    payrolls: 0
  };

  adminChartData = [
    { label: 'Départements', value: 0 },
    { label: 'Employés', value: 0 },
    { label: 'Contrats', value: 0 },
    { label: 'Congés', value: 0 },
    { label: 'Paies', value: 0 },
    { label: 'Prédictions', value: 0 },
    { label: 'Notifications', value: 0 }
  ];

  lineChartLabels = ['RH', 'Emp', 'Ctr', 'Cng', 'Pae', 'Prd', 'Ntf'];

  constructor() {
    this.loadDashboard();
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  loadDashboard(): void {
    this.auth.me().subscribe({
      next: (user) => {
        this.isEmployee = user.roles.includes('Employee');

        if (this.isEmployee) {
          if (!user.employeeId) {
            this.errorMessage = 'Aucun employeeId n’est lié à ce compte.';
            return;
          }

          this.notifications.getByEmployee(user.employeeId).subscribe({
            next: (data) => {
              this.employeeNotifications = data;
              this.employeeStats.notifications = data.length;
            },
            error: () => this.errorMessage = 'Impossible de charger les notifications.'
          });

          this.leaves.getMine().subscribe({
            next: (data) => {
              this.employeeLeaveRequests = data;
              this.employeeStats.leaveRequests = data.length;
            },
            error: () => this.errorMessage = 'Impossible de charger les congés.'
          });

          this.payrolls.getMine().subscribe({
            next: (data) => {
              this.employeePayrolls = data;
              this.employeeStats.payrolls = data.length;
            },
            error: () => this.errorMessage = 'Impossible de charger les paies.'
          });

          return;
        }

        this.departments.getAll().subscribe({
          next: (data) => {
            this.adminStats.departments = data.length;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les départements.'
        });

        this.employees.getAll().subscribe({
          next: (data) => {
            this.adminStats.employees = data.length;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les employés.'
        });

        this.contracts.getAll().subscribe({
          next: (data) => {
            this.adminStats.contracts = data.length;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les contrats.'
        });

        this.leaves.getAll().subscribe({
          next: (data) => {
            this.adminStats.leaveRequests = data.length;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les demandes de congé.'
        });

        this.payrolls.getAll().subscribe({
          next: (data) => {
            this.adminStats.payrolls = data.length;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les paies.'
        });

        this.predictions.getAll().subscribe({
          next: (data) => {
            this.adminStats.predictions = data.length;
            this.latestPrediction = data.length > 0 ? data[0] : null;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les prédictions.'
        });

        this.notifications.getAll().subscribe({
          next: (data) => {
            this.adminStats.notifications = data.length;
            this.syncCharts();
          },
          error: () => this.errorMessage = 'Impossible de charger les notifications.'
        });

        this.anomalies.getAll().subscribe({
          next: (data) => {
            this.anomalyCount = data.length;
            this.latestAnomalies = data.slice(0, 4);
          },
          error: () => this.errorMessage = 'Impossible de charger les anomalies.'
        });
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le profil utilisateur.';
      }
    });
  }

  syncCharts(): void {
    this.adminChartData = [
      { label: 'Départements', value: this.adminStats.departments },
      { label: 'Employés', value: this.adminStats.employees },
      { label: 'Contrats', value: this.adminStats.contracts },
      { label: 'Congés', value: this.adminStats.leaveRequests },
      { label: 'Paies', value: this.adminStats.payrolls },
      { label: 'Prédictions', value: this.adminStats.predictions },
      { label: 'Notifications', value: this.adminStats.notifications }
    ];
  }

  maxAdminValue(): number {
    const values = this.adminChartData.map(x => x.value);
    return Math.max(...values, 1);
  }

  getBarHeightPx(value: number, max: number): number {
    if (max <= 0) return 12;
    if (value <= 0) return 12;
    return Math.max((value / max) * 160, 12);
  }

  adminDonutTotal(): number {
    return this.adminStats.employees + this.adminStats.contracts + this.adminStats.payrolls + this.adminStats.leaveRequests;
  }

  adminDonutSegments(): { employees: number; contracts: number; payrolls: number; leaveRequests: number } {
    const total = this.adminDonutTotal();
    if (!total) {
      return { employees: 0, contracts: 0, payrolls: 0, leaveRequests: 0 };
    }

    return {
      employees: (this.adminStats.employees / total) * 100,
      contracts: (this.adminStats.contracts / total) * 100,
      payrolls: (this.adminStats.payrolls / total) * 100,
      leaveRequests: (this.adminStats.leaveRequests / total) * 100
    };
  }

  lineSeries(): number[] {
    return [
      this.adminStats.departments,
      this.adminStats.employees,
      this.adminStats.contracts,
      this.adminStats.leaveRequests,
      this.adminStats.payrolls,
      this.adminStats.predictions,
      this.adminStats.notifications
    ];
  }

  linePoints(): string {
    const values = this.lineSeries();
    const max = Math.max(...values, 1);
    const startX = 40;
    const width = 420;
    const step = values.length > 1 ? width / (values.length - 1) : width;

    return values
      .map((value, index) => {
        const x = startX + step * index;
        const y = 180 - ((value / max) * 140);
        return `${x},${y}`;
      })
      .join(' ');
  }

  lineDots(): { x: number; y: number }[] {
    const values = this.lineSeries();
    const max = Math.max(...values, 1);
    const startX = 40;
    const width = 420;
    const step = values.length > 1 ? width / (values.length - 1) : width;

    return values.map((value, index) => ({
      x: startX + step * index,
      y: 180 - ((value / max) * 140)
    }));
  }
}