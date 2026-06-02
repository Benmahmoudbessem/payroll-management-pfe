import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { LeaveRequestsService } from '../../core/services/leave-requests.service';
import { PayrollsService } from '../../core/services/payrolls.service';
import { NotificationsService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-employee-space-page',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
    }

    .employee-space {
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
      background: linear-gradient(135deg, #7c3aed, #6366f1, #3b82f6);
      color: white;
      box-shadow: 0 18px 40px rgba(99, 102, 241, 0.24);
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: 30px;
      font-weight: 700;
    }

    .hero p {
      margin: 0;
      max-width: 700px;
      line-height: 1.6;
      opacity: 0.95;
    }

    .hero-badge {
      background: rgba(255,255,255,0.16);
      border: 1px solid rgba(255,255,255,0.18);
      padding: 10px 14px;
      border-radius: 14px;
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

    .profile-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .avatar {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #dbeafe, #e0e7ff);
      color: #3730a3;
      font-size: 26px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .profile-name {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }

    .profile-subtitle {
      margin: 6px 0 0;
      color: #6b7280;
      font-size: 14px;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .profile-item {
      border: 1px solid #eef2f7;
      border-radius: 16px;
      padding: 14px 16px;
      background: #fafcff;
    }

    .profile-item-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .profile-item-value {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }

    .panel {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 22px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      min-height: 320px;
    }

    .panel-title {
      margin: 0 0 6px;
      font-size: 21px;
      font-weight: 700;
      color: #111827;
    }

    .panel-subtitle {
      margin: 0 0 18px;
      color: #6b7280;
      font-size: 14px;
    }

    .item-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .item-card {
      border: 1px solid #eef2f7;
      border-radius: 16px;
      padding: 14px;
      background: #fcfdff;
    }

    .item-title {
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }

    .item-meta {
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

    .money {
      color: #047857;
      font-weight: 700;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 32px 10px;
      border: 1px dashed #dbe3ef;
      border-radius: 16px;
      background: #fafcff;
    }

    .small-date {
      display: block;
      margin-top: 6px;
      color: #94a3b8;
      font-size: 12px;
    }

    @media (max-width: 1100px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 800px) {
      .stats-grid,
      .profile-grid {
        grid-template-columns: 1fr;
      }

      .hero,
      .profile-card,
      .panel {
        padding: 18px;
      }

      .avatar {
        width: 64px;
        height: 64px;
        font-size: 22px;
      }
    }
  `],
  template: `
    <section class="employee-space">
      <div class="hero">
        <div>
          <h1>Mon espace employé</h1>
          <p>
            Consulte tes informations personnelles, tes fiches de paie,
            tes demandes de congé et tes notifications dans une interface claire
            et professionnelle.
          </p>
        </div>
        <div class="hero-badge">Espace personnel</div>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Mes paies</div>
          <div class="stat-value">{{ payrolls.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mes congés</div>
          <div class="stat-value">{{ leaveRequests.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mes notifications</div>
          <div class="stat-value">{{ notifications.length }}</div>
        </div>
      </div>

      <div *ngIf="employeeProfile" class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ getInitials(employeeProfile.firstName, employeeProfile.lastName) }}
          </div>
          <div>
            <h2 class="profile-name">
              {{ employeeProfile.firstName }} {{ employeeProfile.lastName }}
            </h2>
            <p class="profile-subtitle">
              {{ employeeProfile.position }} • {{ employeeProfile.department?.name || 'Département non défini' }}
            </p>
          </div>
        </div>

        <div class="profile-grid">
          <div class="profile-item">
            <div class="profile-item-label">Matricule</div>
            <div class="profile-item-value">{{ employeeProfile.matricule }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Email</div>
            <div class="profile-item-value">{{ employeeProfile.email }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Téléphone</div>
            <div class="profile-item-value">{{ employeeProfile.phone }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Salaire de base</div>
            <div class="profile-item-value money">{{ employeeProfile.baseSalary }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Date de naissance</div>
            <div class="profile-item-value">{{ employeeProfile.dateOfBirth | date:'yyyy-MM-dd' }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Date d’embauche</div>
            <div class="profile-item-value">{{ employeeProfile.hireDate | date:'yyyy-MM-dd' }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Adresse</div>
            <div class="profile-item-value">{{ employeeProfile.address }}</div>
          </div>

          <div class="profile-item">
            <div class="profile-item-label">Département</div>
            <div class="profile-item-value">{{ employeeProfile.department?.name || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel">
          <h3 class="panel-title">Mes paies</h3>
          <p class="panel-subtitle">Historique de mes paies et de leur statut.</p>

          <div *ngIf="payrolls.length === 0" class="empty-state">
            Aucune paie disponible.
          </div>

          <div *ngIf="payrolls.length > 0" class="item-list">
            <div *ngFor="let p of payrolls" class="item-card">
              <div class="item-title">{{ p.month }}/{{ p.year }}</div>
              <div class="item-meta">
                Salaire net : <span class="money">{{ p.netSalary }}</span><br>
                Salaire brut : {{ p.grossSalary }}
              </div>
              <div class="badge">{{ p.validationStatus }}</div>
              <span class="small-date">
                Générée le {{ p.generatedAt | date:'yyyy-MM-dd HH:mm' }}
              </span>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3 class="panel-title">Mes congés</h3>
          <p class="panel-subtitle">Suivi de mes demandes de congé.</p>

          <div *ngIf="leaveRequests.length === 0" class="empty-state">
            Aucune demande de congé.
          </div>

          <div *ngIf="leaveRequests.length > 0" class="item-list">
            <div *ngFor="let l of leaveRequests" class="item-card">
              <div class="item-title">{{ l.leaveType }}</div>
              <div class="item-meta">
                Du {{ l.startDate | date:'yyyy-MM-dd' }}
                au {{ l.endDate | date:'yyyy-MM-dd' }}<br>
                Motif : {{ l.reason || '-' }}
              </div>
              <div class="badge">{{ l.status }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3 class="panel-title">Mes notifications</h3>
          <p class="panel-subtitle">Messages et alertes reçus du système.</p>

          <div *ngIf="notifications.length === 0" class="empty-state">
            Aucune notification disponible.
          </div>

          <div *ngIf="notifications.length > 0" class="item-list">
            <div *ngFor="let n of notifications" class="item-card">
              <div class="item-title">{{ n.title }}</div>
              <div class="item-meta">
                {{ n.message }}
              </div>
              <span class="small-date">
                {{ n.sentAt | date:'yyyy-MM-dd HH:mm' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class EmployeeSpacePageComponent {
  private readonly auth = inject(AuthService);
  private readonly employeeService = inject(EmployeeService);
  private readonly leaveService = inject(LeaveRequestsService);
  private readonly payrollService = inject(PayrollsService);
  private readonly notificationsService = inject(NotificationsService);

  employeeProfile: any = null;
  leaveRequests: any[] = [];
  payrolls: any[] = [];
  notifications: any[] = [];
  errorMessage = '';

  constructor() {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.auth.me().subscribe({
      next: (user) => {
        if (!user.employeeId) {
          this.errorMessage = 'Aucun employeeId n’est lié à ce compte.';
          return;
        }

        this.employeeService.getById(user.employeeId).subscribe({
          next: (data) => this.employeeProfile = data,
          error: () => this.errorMessage = 'Impossible de charger le profil employé.'
        });

        this.leaveService.getMine().subscribe({
          next: (data) => this.leaveRequests = data,
          error: () => this.errorMessage = 'Impossible de charger mes congés.'
        });

        this.payrollService.getMine().subscribe({
          next: (data) => this.payrolls = data,
          error: () => this.errorMessage = 'Impossible de charger mes paies.'
        });

        this.notificationsService.getByEmployee(user.employeeId).subscribe({
          next: (data) => this.notifications = data,
          error: () => this.errorMessage = 'Impossible de charger les notifications.'
        });
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le compte connecté.';
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  }
}