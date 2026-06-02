import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequestsService } from '../../core/services/leave-requests.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { LeaveRequest } from '../../models/leave.models';
import { Employee } from '../../models/employee.models';

@Component({
  selector: 'app-leave-requests-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host {
      display: block;
    }

    .leave-page {
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
      background: linear-gradient(135deg, #ea580c, #f97316, #fb923c);
      color: white;
      box-shadow: 0 18px 40px rgba(249, 115, 22, 0.22);
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 24px;
      align-items: start;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    .panel-title {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 700;
      color: #111827;
    }

    .panel-subtitle {
      margin: 0 0 22px;
      color: #6b7280;
      font-size: 14px;
    }

    .alert {
      border-radius: 14px;
      padding: 14px 16px;
      font-size: 14px;
      margin-bottom: 18px;
    }

    .alert-success {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .alert-error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 14px;
      padding: 12px 14px;
      background: #fff;
      outline: none;
      transition: all 0.2s ease;
      resize: vertical;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #f97316;
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.12);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .btn-primary,
    .btn-approve,
    .btn-reject {
      border: none;
      border-radius: 14px;
      padding: 12px 18px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ea580c, #f97316);
      color: white;
      box-shadow: 0 10px 22px rgba(249, 115, 22, 0.22);
    }

    .btn-primary:hover,
    .btn-approve:hover,
    .btn-reject:hover {
      transform: translateY(-1px);
    }

    .btn-primary:disabled,
    .btn-approve:disabled,
    .btn-reject:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-approve {
      background: #dcfce7;
      color: #166534;
      padding: 8px 12px;
      border-radius: 10px;
    }

    .btn-reject {
      background: #fee2e2;
      color: #b91c1c;
      padding: 8px 12px;
      border-radius: 10px;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }

    .search-box {
      min-width: 260px;
      flex: 1;
      max-width: 360px;
    }

    .search-box input {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 14px;
      padding: 12px 14px;
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
      white-space: nowrap;
    }

    tbody td {
      padding: 15px 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
      color: #111827;
      font-size: 14px;
    }

    tbody tr:hover {
      background: #fffaf5;
    }

    .employee-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #ffedd5;
      color: #c2410c;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .employee-name {
      font-weight: 700;
      color: #111827;
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
      font-size: 12px;
      font-weight: 700;
    }

    .badge-pending {
      background: #fff7ed;
      color: #c2410c;
    }

    .badge-approved {
      background: #f0fdf4;
      color: #166534;
    }

    .badge-rejected {
      background: #fef2f2;
      color: #b91c1c;
    }

    .period {
      color: #374151;
      font-weight: 600;
    }

    .reason {
      color: #6b7280;
      font-size: 13px;
      line-height: 1.5;
      margin-top: 4px;
    }

    .table-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .empty-state {
      text-align: center;
      padding: 28px;
      color: #6b7280;
    }

    @media (max-width: 1100px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid,
      .form-grid {
        grid-template-columns: 1fr;
      }

      .hero {
        padding: 22px;
      }

      .panel {
        padding: 18px;
      }
    }
  `],
  template: `
    <section class="leave-page">
      <div class="hero">
        <div>
          <h1>Demandes de congé</h1>
          <p>
            {{ isEmployee
              ? 'Consulte et crée uniquement tes propres demandes de congé.'
              : 'Gère les demandes de congé des employés dans une interface moderne et professionnelle.' }}
          </p>
        </div>
        <div class="hero-badge">{{ isEmployee ? 'Mes congés' : 'Gestion des absences' }}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ isEmployee ? 'Mes demandes' : 'Total demandes' }}</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Demandes affichées</div>
          <div class="stat-value">{{ filteredItems().length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ isEmployee ? 'Mon compte' : 'Employés disponibles' }}</div>
          <div class="stat-value">{{ isEmployee ? 1 : employees.length }}</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel">
          <h2 class="panel-title">Nouvelle demande</h2>
          <p class="panel-subtitle">
            {{ isEmployee ? 'Crée ta propre demande de congé.' : 'Crée une nouvelle demande de congé pour un employé.' }}
          </p>

          <div *ngIf="message" class="alert alert-success">{{ message }}</div>
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <form [formGroup]="form" (ngSubmit)="create()">
            <div class="form-grid">
              <div class="form-group full" *ngIf="!isEmployee; else employeeInfoBlock">
                <label>Employé</label>
                <select formControlName="employeeId">
                  <option value="">Choisir un employé</option>
                  <option *ngFor="let e of employees" [value]="e.id">
                    {{ e.firstName }} {{ e.lastName }} - {{ e.matricule }}
                  </option>
                </select>
              </div>

              <ng-template #employeeInfoBlock>
                <div class="form-group full">
                  <label>Employé</label>
                  <input [value]="'Ma demande personnelle'" disabled />
                </div>
              </ng-template>

              <div class="form-group full">
                <label>Type de congé</label>
                <input formControlName="leaveType" placeholder="Annuel, Maladie, Exceptionnel..." />
              </div>

              <div class="form-group">
                <label>Date de début</label>
                <input type="date" formControlName="startDate" />
              </div>

              <div class="form-group">
                <label>Date de fin</label>
                <input type="date" formControlName="endDate" />
              </div>

              <div class="form-group full">
                <label>Motif</label>
                <textarea
                  formControlName="reason"
                  rows="5"
                  placeholder="Renseigner le motif de la demande..."
                ></textarea>
              </div>
            </div>

            <div class="actions">
              <button class="btn-primary" [disabled]="form.invalid || loading">
                {{ loading ? 'Ajout en cours...' : 'Ajouter la demande' }}
              </button>
            </div>
          </form>
        </div>

        <div class="panel">
          <h2 class="panel-title">Liste des demandes</h2>
          <p class="panel-subtitle">
            {{ isEmployee
              ? 'Consulte uniquement tes propres demandes de congé.'
              : 'Consulte, approuve ou rejette les demandes de congé.' }}
          </p>

          <div class="toolbar">
            <div class="search-box">
              <input
                type="text"
                [value]="searchTerm()"
                (input)="searchTerm.set(($any($event.target).value || '').trim())"
                placeholder="Rechercher par type ou statut..."
              />
            </div>
          </div>

          <div class="table-wrapper" *ngIf="filteredItems().length > 0; else emptyTpl">
            <table>
              <thead>
                <tr>
                  <th>Employé</th>
                  <th>Type</th>
                  <th>Période</th>
                  <th>Motif</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of filteredItems()">
                  <td>
                    <div class="employee-cell">
                      <div class="avatar">
                        {{ getInitials(item.employee?.firstName || '', item.employee?.lastName || '') }}
                      </div>
                      <div>
                        <div class="employee-name">
                          {{ item.employee?.firstName || '-' }} {{ item.employee?.lastName || '' }}
                        </div>
                        <div class="employee-meta">
                          {{ item.employee?.matricule || 'Aucun matricule' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ item.leaveType }}</td>
                  <td>
                    <div class="period">
                      {{ item.startDate | date:'yyyy-MM-dd' }} → {{ item.endDate | date:'yyyy-MM-dd' }}
                    </div>
                  </td>
                  <td>
                    <div class="reason">{{ item.reason || '-' }}</div>
                  </td>
                  <td>
                    <span
                      class="badge"
                      [ngClass]="{
                        'badge-pending': item.status === 'Pending',
                        'badge-approved': item.status === 'Approved',
                        'badge-rejected': item.status === 'Rejected'
                      }"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions" *ngIf="!isEmployee && item.status === 'Pending'; else noActions">
                      <button
                        class="btn-approve"
                        type="button"
                        [disabled]="processingId === item.id"
                        (click)="approve(item)"
                      >
                        Approuver
                      </button>
                      <button
                        class="btn-reject"
                        type="button"
                        [disabled]="processingId === item.id"
                        (click)="reject(item)"
                      >
                        Rejeter
                      </button>
                    </div>

                    <ng-template #noActions>
                      <span>-</span>
                    </ng-template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyTpl>
            <div class="empty-state">
              Aucune demande de congé trouvée pour le moment.
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `
})
export class LeaveRequestsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(LeaveRequestsService);
  private readonly employeesService = inject(EmployeeService);
  private readonly auth = inject(AuthService);

  items: LeaveRequest[] = [];
  employees: Employee[] = [];
  loading = false;
  processingId: string | null = null;
  message = '';
  errorMessage = '';

  isEmployee = false;
  currentEmployeeId = '';

  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.items;

    return this.items.filter(item =>
      `${item.employee?.firstName || ''} ${item.employee?.lastName || ''}`.toLowerCase().includes(term) ||
      (item.employee?.matricule || '').toLowerCase().includes(term) ||
      (item.leaveType || '').toLowerCase().includes(term) ||
      (item.status || '').toLowerCase().includes(term) ||
      (item.reason || '').toLowerCase().includes(term)
    );
  });

  form = this.fb.nonNullable.group({
    employeeId: ['', Validators.required],
    leaveType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', Validators.required]
  });

  constructor() {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.auth.me().subscribe({
      next: (user) => {
        this.isEmployee = user.roles.includes('Employee');
        this.currentEmployeeId = user.employeeId || '';

        if (this.isEmployee && this.currentEmployeeId) {
          this.form.patchValue({
            employeeId: this.currentEmployeeId
          });
        }

        this.loadAll();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le profil utilisateur.';
      }
    });
  }

  loadAll(): void {
    this.errorMessage = '';

    if (this.isEmployee) {
      this.service.getMine().subscribe({
        next: (data) => {
          this.items = data;
        },
        error: () => {
          this.errorMessage = 'Impossible de charger vos demandes de congé.';
        }
      });

      this.employees = [];
      return;
    }

    this.service.getAll().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les demandes de congé.';
      }
    });

    this.employeesService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => {}
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const raw = this.form.getRawValue();

    const payload = {
      employeeId: this.isEmployee ? this.currentEmployeeId : raw.employeeId,
      leaveType: raw.leaveType,
      startDate: raw.startDate,
      endDate: raw.endDate,
      reason: raw.reason
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Demande ajoutée avec succès.';
        this.form.reset({
          employeeId: this.isEmployee ? this.currentEmployeeId : '',
          leaveType: '',
          startDate: '',
          endDate: '',
          reason: ''
        });
        this.loadAll();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Ajout impossible.';
      }
    });
  }

  approve(item: LeaveRequest): void {
    this.processingId = item.id;
    this.message = '';
    this.errorMessage = '';

    this.service.approve(item.id).subscribe({
      next: () => {
        this.processingId = null;
        this.message = 'Demande approuvée avec succès.';
        this.loadAll();
      },
      error: (err) => {
        this.processingId = null;
        this.errorMessage = err?.error?.message || 'Approbation impossible.';
      }
    });
  }

  reject(item: LeaveRequest): void {
    this.processingId = item.id;
    this.message = '';
    this.errorMessage = '';

    this.service.reject(item.id).subscribe({
      next: () => {
        this.processingId = null;
        this.message = 'Demande rejetée avec succès.';
        this.loadAll();
      },
      error: (err) => {
        this.processingId = null;
        this.errorMessage = err?.error?.message || 'Rejet impossible.';
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  }
}