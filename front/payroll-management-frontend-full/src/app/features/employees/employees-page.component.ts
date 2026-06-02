import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Department } from '../../models/department.models';
import { Employee } from '../../models/employee.models';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host {
      display: block;
    }

    .employees-page {
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
      background: linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6);
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
      opacity: 0.95;
      max-width: 650px;
      line-height: 1.5;
    }

    .hero-badge {
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.2);
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
      grid-template-columns: 1.05fr 1.35fr;
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

    .table-card {
      overflow: hidden;
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
      background: #f9fbff;
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

    .employee-email {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 700;
    }

    .salary {
      font-weight: 700;
      color: #047857;
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
    <section class="employees-page">
      <div class="hero">
        <div>
          <h1>Gestion des employés</h1>
          <p>
            Ajoute, modifie, supprime et organise les employés dans une interface claire,
            moderne et adaptée à une plateforme professionnelle de gestion de la paie.
          </p>
        </div>
        <div class="hero-badge">CRUD complet</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total employés</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Départements disponibles</div>
          <div class="stat-value">{{ departments.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mode</div>
          <div class="stat-value">{{ editingId ? 'Edit' : 'Ajout' }}</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel">
          <h2 class="panel-title">
            {{ editingId ? 'Modifier un employé' : 'Ajouter un employé' }}
          </h2>
          <p class="panel-subtitle">
            {{ editingId
              ? 'Modifie les informations principales de l’employé.'
              : 'Renseigne les informations principales de l’employé.' }}
          </p>

          <div *ngIf="message" class="alert alert-success">{{ message }}</div>
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-grid">
              <div class="form-group">
                <label>Matricule</label>
                <input formControlName="matricule" placeholder="EMP001" />
              </div>

              <div class="form-group">
                <label>CIN</label>
                <input formControlName="cin" placeholder="12345678" />
              </div>

              <div class="form-group">
                <label>Prénom</label>
                <input formControlName="firstName" placeholder="Bessem" />
              </div>

              <div class="form-group">
                <label>Nom</label>
                <input formControlName="lastName" placeholder="Ben Mahmoud" />
              </div>

              <div class="form-group">
                <label>Email</label>
                <input formControlName="email" placeholder="exemple@email.com" />
              </div>

              <div class="form-group">
                <label>Téléphone</label>
                <input formControlName="phone" placeholder="+216 xx xxx xxx" />
              </div>

              <div class="form-group">
                <label>Poste</label>
                <input formControlName="position" placeholder="Développeur, RH..." />
              </div>

              <div class="form-group">
                <label>Département</label>
                <select formControlName="departmentId">
                  <option value="">Choisir un département</option>
                  <option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Date de naissance</label>
                <input type="date" formControlName="dateOfBirth" />
              </div>

              <div class="form-group">
                <label>Date d’embauche</label>
                <input type="date" formControlName="hireDate" />
              </div>

              <div class="form-group">
                <label>Salaire de base</label>
                <input type="number" formControlName="baseSalary" placeholder="1200" />
              </div>

              <div class="form-group">
                <label>Adresse</label>
                <input formControlName="address" placeholder="Adresse complète" />
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
                    : (editingId ? 'Modifier l’employé' : 'Ajouter l’employé')
                }}
              </button>
            </div>
          </form>
        </div>

        <div class="panel table-card">
          <h2 class="panel-title">Liste des employés</h2>
          <p class="panel-subtitle">Consulte, modifie ou supprime rapidement les employés enregistrés.</p>

          <div class="toolbar">
            <div class="search-box">
              <input
                type="text"
                [value]="searchTerm()"
                (input)="searchTerm.set(($any($event.target).value || '').trim())"
                placeholder="Rechercher par nom, matricule, email ou poste..."
              />
            </div>
          </div>

          <div class="table-wrapper" *ngIf="filteredItems().length > 0; else emptyTpl">
            <table>
              <thead>
                <tr>
                  <th>Employé</th>
                  <th>Matricule</th>
                  <th>Poste</th>
                  <th>Département</th>
                  <th>Salaire</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let e of filteredItems()">
                  <td>
                    <div class="employee-cell">
                      <div class="avatar">{{ getInitials(e.firstName, e.lastName) }}</div>
                      <div>
                        <div class="employee-name">{{ e.firstName }} {{ e.lastName }}</div>
                        <div class="employee-email">{{ e.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ e.matricule }}</td>
                  <td><span class="badge">{{ e.position }}</span></td>
                  <td>{{ e.department?.name || '-' }}</td>
                  <td class="salary">{{ e.baseSalary | number:'1.0-2' }}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-edit" type="button" (click)="edit(e)">
                        Modifier
                      </button>
                      <button class="btn-danger" type="button" (click)="remove(e)">
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
              Aucun employé trouvé pour le moment.
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `
})
export class EmployeesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);

  items: Employee[] = [];
  departments: Department[] = [];
  loading = false;
  message = '';
  errorMessage = '';
  editingId: string | null = null;

  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.items;

    return this.items.filter(e =>
      `${e.firstName ?? ''} ${e.lastName ?? ''}`.toLowerCase().includes(term) ||
      (e.matricule ?? '').toLowerCase().includes(term) ||
      (e.email ?? '').toLowerCase().includes(term) ||
      (e.position ?? '').toLowerCase().includes(term) ||
      (e.department?.name ?? '').toLowerCase().includes(term)
    );
  });

  form = this.fb.nonNullable.group({
    matricule: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    cin: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    position: ['', Validators.required],
    hireDate: ['', Validators.required],
    baseSalary: [0, [Validators.required, Validators.min(1)]],
    departmentId: ['', Validators.required]
  });

  constructor() {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les départements.';
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.items = data;
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
      ...raw,
      baseSalary: Number(raw.baseSalary)
    };

    if (this.editingId) {
      this.employeeService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Employé modifié avec succès.';
          this.cancelEdit(false);
          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Modification employé impossible.';
        }
      });
    } else {
      this.employeeService.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Employé ajouté avec succès.';
          this.resetForm();
          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Ajout employé impossible.';
        }
      });
    }
  }

  edit(employee: Employee): void {
    this.editingId = employee.id;
    this.message = '';
    this.errorMessage = '';

    this.form.patchValue({
      matricule: employee.matricule ?? '',
      firstName: employee.firstName ?? '',
      lastName: employee.lastName ?? '',
      dateOfBirth: this.toDateInput(employee.dateOfBirth),
      cin: employee.cin ?? '',
      address: employee.address ?? '',
      phone: employee.phone ?? '',
      email: employee.email ?? '',
      position: employee.position ?? '',
      hireDate: this.toDateInput(employee.hireDate),
      baseSalary: Number(employee.baseSalary ?? 0),
      departmentId: employee.departmentId ?? ''
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

  remove(employee: Employee): void {
    const ok = confirm(`Voulez-vous vraiment supprimer l’employé "${employee.firstName} ${employee.lastName}" ?`);
    if (!ok) return;

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.employeeService.delete(employee.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Employé supprimé avec succès.';

        if (this.editingId === employee.id) {
          this.cancelEdit(false);
        }

        this.loadEmployees();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Suppression employé impossible.';
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
      matricule: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      cin: '',
      address: '',
      phone: '',
      email: '',
      position: '',
      hireDate: '',
      baseSalary: 0,
      departmentId: ''
    });
  }

  private toDateInput(value: string | Date | null | undefined): string {
    if (!value) return '';

    if (typeof value === 'string') {
      return value.length >= 10 ? value.slice(0, 10) : value;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}