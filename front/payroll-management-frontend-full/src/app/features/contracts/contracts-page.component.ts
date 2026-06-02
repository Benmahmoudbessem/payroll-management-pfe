import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractsService } from '../../core/services/contracts.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Contract } from '../../models/contract.models';
import { Employee } from '../../models/employee.models';

@Component({
  selector: 'app-contracts-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host {
      display: block;
    }

    .contracts-page {
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
      background: linear-gradient(135deg, #1e3a8a, #2563eb, #60a5fa);
      color: white;
      box-shadow: 0 18px 40px rgba(37, 99, 235, 0.22);
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
      grid-template-columns: 1fr 1.35fr;
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
    .form-group select {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 14px;
      padding: 12px 14px;
      background: #fff;
      outline: none;
      transition: all 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary,
    .btn-edit,
    .btn-danger {
      border: none;
      border-radius: 14px;
      padding: 12px 18px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      color: white;
      box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(37, 99, 235, 0.25);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #111827;
    }

    .btn-edit {
      background: #eff6ff;
      color: #1d4ed8;
      padding: 8px 12px;
      border-radius: 10px;
    }

    .btn-danger {
      background: #fef2f2;
      color: #b91c1c;
      padding: 8px 12px;
      border-radius: 10px;
    }

    .btn-primary:disabled,
    .btn-secondary:disabled,
    .btn-edit:disabled,
    .btn-danger:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
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
      background: #f8fbff;
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
      background: #dbeafe;
      color: #1d4ed8;
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

    .badge-active {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .badge-ended {
      background: #f3f4f6;
      color: #374151;
    }

    .badge-suspended {
      background: #fef2f2;
      color: #b91c1c;
    }

    .salary {
      color: #047857;
      font-weight: 700;
    }

    .period {
      color: #374151;
      font-weight: 600;
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
    <section class="contracts-page">
      <div class="hero">
        <div>
          <h1>Gestion des contrats</h1>
          <p>
            Crée, modifie, supprime et organise les contrats des employés dans une interface
            claire, moderne et adaptée à une plateforme professionnelle RH et paie.
          </p>
        </div>
        <div class="hero-badge">CRUD complet</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total contrats</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Résultats affichés</div>
          <div class="stat-value">{{ filteredItems().length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mode</div>
          <div class="stat-value">{{ editingId ? 'Edit' : 'Ajout' }}</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel">
          <h2 class="panel-title">
            {{ editingId ? 'Modifier un contrat' : 'Ajouter un contrat' }}
          </h2>
          <p class="panel-subtitle">
            {{
              editingId
                ? 'Modifie les détails du contrat sélectionné.'
                : 'Associe un contrat à un employé avec les détails essentiels.'
            }}
          </p>

          <div *ngIf="message" class="alert alert-success">{{ message }}</div>
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-grid">
              <div class="form-group full">
                <label>Employé</label>
                <select formControlName="employeeId">
                  <option value="">Choisir un employé</option>
                  <option *ngFor="let e of employees" [value]="e.id">
                    {{ e.firstName }} {{ e.lastName }} - {{ e.matricule }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Type de contrat</label>
                <input formControlName="contractType" placeholder="CDI, CDD, Stage..." />
              </div>

              <div class="form-group">
                <label>Statut</label>
                <select formControlName="status">
                  <option value="Active">Active</option>
                  <option value="Ended">Ended</option>
                  <option value="Suspended">Suspended</option>
                </select>
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
                <label>Salaire de base</label>
                <input type="number" formControlName="baseSalary" placeholder="1500" />
              </div>
            </div>

            <div class="actions">
              <button
                type="button"
                class="btn-secondary"
                *ngIf="editingId"
                (click)="cancelEdit()"
              >
                Annuler
              </button>

              <button class="btn-primary" [disabled]="form.invalid || loading">
                {{
                  loading
                    ? (editingId ? 'Modification...' : 'Ajout en cours...')
                    : (editingId ? 'Modifier le contrat' : 'Ajouter le contrat')
                }}
              </button>
            </div>
          </form>
        </div>

        <div class="panel">
          <h2 class="panel-title">Liste des contrats</h2>
          <p class="panel-subtitle">Consulte, modifie ou supprime les contrats enregistrés.</p>

          <div class="toolbar">
            <div class="search-box">
              <input
                type="text"
                [value]="searchTerm()"
                (input)="searchTerm.set(($any($event.target).value || '').trim())"
                placeholder="Rechercher par employé, type ou statut..."
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
                  <th>Salaire</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of filteredItems()">
                  <td>
                    <div class="employee-cell">
                      <div class="avatar">
                        {{ getInitials(c.employee?.firstName || '', c.employee?.lastName || '') }}
                      </div>
                      <div>
                        <div class="employee-name">
                          {{ c.employee?.firstName || '-' }} {{ c.employee?.lastName || '' }}
                        </div>
                        <div class="employee-meta">
                          {{ c.employee?.matricule || 'Aucun matricule' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ c.contractType }}</td>
                  <td>
                    <div class="period">
                      {{ c.startDate | date:'yyyy-MM-dd' }} →
                      {{ c.endDate ? (c.endDate | date:'yyyy-MM-dd') : '---' }}
                    </div>
                  </td>
                  <td class="salary">{{ c.baseSalary | number:'1.0-2' }}</td>
                  <td>
                    <span
                      class="badge"
                      [ngClass]="{
                        'badge-active': c.status === 'Active',
                        'badge-ended': c.status === 'Ended',
                        'badge-suspended': c.status === 'Suspended'
                      }"
                    >
                      {{ c.status }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-edit" type="button" (click)="edit(c)">
                        Modifier
                      </button>
                      <button class="btn-danger" type="button" (click)="remove(c)">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyTpl>
            <div class="empty-state">
              Aucun contrat trouvé pour le moment.
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `
})
export class ContractsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contractsService = inject(ContractsService);
  private readonly employeesService = inject(EmployeeService);

  items: Contract[] = [];
  employees: Employee[] = [];
  loading = false;
  message = '';
  errorMessage = '';
  editingId: string | null = null;

  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.items;
    }

    return this.items.filter((c) =>
      `${c.employee?.firstName || ''} ${c.employee?.lastName || ''}`.toLowerCase().includes(term) ||
      (c.employee?.matricule || '').toLowerCase().includes(term) ||
      (c.contractType || '').toLowerCase().includes(term) ||
      (c.status || '').toLowerCase().includes(term)
    );
  });

  form = this.fb.nonNullable.group({
    employeeId: ['', Validators.required],
    contractType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    baseSalary: [0, [Validators.required, Validators.min(1)]],
    status: ['Active', Validators.required]
  });

  constructor() {
    this.loadAll();
  }

  loadAll(): void {
    this.contractsService.getAll().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les contrats.';
      }
    });

    this.employeesService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les employés.';
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const raw = this.form.getRawValue();
    const payload = {
      employeeId: raw.employeeId,
      contractType: raw.contractType,
      startDate: raw.startDate,
      endDate: raw.endDate || null,
      baseSalary: Number(raw.baseSalary),
      status: raw.status
    };

    if (this.editingId) {
      this.contractsService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Contrat modifié avec succès.';
          this.cancelEdit(false);
          this.loadAll();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Modification contrat impossible.';
        }
      });
    } else {
      this.contractsService.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Contrat ajouté avec succès.';
          this.resetForm();
          this.loadAll();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Ajout contrat impossible.';
        }
      });
    }
  }

  edit(contract: Contract): void {
    this.editingId = contract.id;
    this.message = '';
    this.errorMessage = '';

    this.form.patchValue({
      employeeId: contract.employeeId ?? '',
      contractType: contract.contractType ?? '',
      startDate: this.toDateInput(contract.startDate),
      endDate: this.toDateInput(contract.endDate),
      baseSalary: Number(contract.baseSalary ?? 0),
      status: contract.status ?? 'Active'
    });
  }

  cancelEdit(clearMessage: boolean = true): void {
    this.editingId = null;
    this.resetForm();

    if (clearMessage) {
      this.message = '';
      this.errorMessage = '';
    }
  }

  remove(contract: Contract): void {
    const ok = confirm(`Voulez-vous vraiment supprimer le contrat "${contract.contractType}" ?`);
    if (!ok) {
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.contractsService.delete(contract.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Contrat supprimé avec succès.';

        if (this.editingId === contract.id) {
          this.cancelEdit(false);
        }

        this.loadAll();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Suppression contrat impossible.';
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  }

  private resetForm(): void {
    this.form.reset({
      employeeId: '',
      contractType: '',
      startDate: '',
      endDate: '',
      baseSalary: 0,
      status: 'Active'
    });
  }

  private toDateInput(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value.length >= 10 ? value.slice(0, 10) : value;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}