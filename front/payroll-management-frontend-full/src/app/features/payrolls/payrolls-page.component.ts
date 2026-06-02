import { Component, computed, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { PayrollsService } from '../../core/services/payrolls.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee } from '../../models/employee.models';
import { Payroll } from '../../models/payroll.models';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-payrolls-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="payrolls-page">
      <div class="hero">
        <div>
          <h1>{{ isEmployee ? 'Mes paies' : 'Gestion des paies' }}</h1>
          <p>
            {{ isEmployee
              ? 'Consulte et télécharge uniquement tes propres fiches de paie.'
              : 'Création, modification, suppression et consultation des fiches de paie.' }}
          </p>
        </div>
        <div class="hero-badge">{{ isEmployee ? 'Mes fiches' : 'Paie RH' }}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ isEmployee ? 'Mes paies' : 'Total paies' }}</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ isEmployee ? 'Mon compte' : 'Employés' }}</div>
          <div class="stat-value">{{ isEmployee ? 1 : employees.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Mode</div>
          <div class="stat-value">{{ isEmployee ? 'Consultation' : (editingId ? 'Édition' : 'Ajout') }}</div>
        </div>
      </div>

      <div *ngIf="message" class="alert alert-success">{{ message }}</div>
      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <div class="content-grid">
        <div class="card" *ngIf="!isEmployee">
          <h3>{{ editingId ? 'Modifier une paie' : 'Créer une paie' }}</h3>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-group">
              <label>Employé</label>
              <select formControlName="employeeId">
                <option value="">Choisir...</option>
                <option *ngFor="let e of employees" [value]="e.id">
                  {{ e.firstName }} {{ e.lastName }} - {{ e.matricule }}
                </option>
              </select>
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Mois</label>
                <input type="number" formControlName="month" />
              </div>
              <div class="form-group">
                <label>Année</label>
                <input type="number" formControlName="year" />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Prime</label>
                <input type="number" formControlName="bonus" />
              </div>
              <div class="form-group">
                <label>Indemnité</label>
                <input type="number" formControlName="allowance" />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="form-group">
                <label>Heures sup.</label>
                <input type="number" formControlName="overtimeAmount" />
              </div>
              <div class="form-group">
                <label>Retenues</label>
                <input type="number" formControlName="deductions" />
              </div>
            </div>

            <div class="form-group">
              <label>Cotisations</label>
              <input type="number" formControlName="contributions" />
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
                    ? (editingId ? 'Modification...' : 'Création...')
                    : (editingId ? 'Modifier la paie' : 'Créer la paie')
                }}
              </button>
            </div>
          </form>
        </div>

        <div class="card">
          <h3>{{ isEmployee ? 'Mes fiches de paie' : 'Liste des paies' }}</h3>

          <div class="search-box">
            <input
              type="text"
              [value]="searchTerm()"
              (input)="searchTerm.set(($any($event.target).value || '').trim())"
              placeholder="Rechercher par période ou matricule..."
            />
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employé</th>
                  <th>Période</th>
                  <th>Net</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of filteredItems()">
                  <td>{{ p.employee?.firstName || '-' }} {{ p.employee?.lastName || '' }}</td>
                  <td>{{ p.month }}/{{ p.year }}</td>
                  <td>{{ p.netSalary | number:'1.2-2' }}</td>
                  <td>
                    <span class="badge" [ngClass]="getValidationStatusClass(p.validationStatus)">
                      {{ getValidationStatusLabel(p.validationStatus) }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-action" type="button" (click)="showPayslip(p)">
                        Fiche
                      </button>
                      <button class="btn-action" type="button" (click)="previewPayslip(p)">
                        Ouvrir
                      </button>
                      <button class="btn-action" type="button" (click)="downloadPayslipPdf(p)">
                        PDF
                      </button>

                      <ng-container *ngIf="!isEmployee">
                        <button class="btn-edit" type="button" (click)="edit(p)">
                          Modifier
                        </button>
                        <button class="btn-danger" type="button" (click)="remove(p)">
                          Supprimer
                        </button>
                      </ng-container>
                    </div>
                  </td>
                </tr>

                <tr *ngIf="filteredItems().length === 0">
                  <td colspan="5" class="empty">Aucune paie trouvée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card payslip-card" *ngIf="selectedPayroll">
        <div
          #payslipContent
          style="border:1px solid #e5e7eb; border-radius:20px; overflow:hidden; background:#fff;"
        >
          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:16px;
              flex-wrap:wrap;
              padding:22px 24px;
              background:linear-gradient(135deg,#0f172a,#1d4ed8);
              color:white;
            "
          >
            <div style="display:flex; align-items:center; gap:14px;">
              <img
                [src]="companyLogoUrl"
                alt="Logo"
                style="width:64px; height:64px; object-fit:contain; background:white; border-radius:12px; padding:6px;"
              />
              <div>
                <div style="font-size:22px; font-weight:700;">{{ companyName }}</div>
                <div style="font-size:13px; opacity:.92;">{{ companyAddress }}</div>
                <div style="font-size:13px; opacity:.92;">{{ companyEmail }} • {{ companyPhone }}</div>
              </div>
            </div>

            <div style="text-align:right;">
              <div style="font-size:26px; font-weight:800;">Fiche de paie</div>
              <div style="font-size:13px; opacity:.95;">
                {{ selectedPayroll.month }}/{{ selectedPayroll.year }}
              </div>
            </div>
          </div>

          <div style="padding:24px;">
            <div
              style="
                display:grid;
                grid-template-columns:repeat(2,minmax(0,1fr));
                gap:14px;
                margin-bottom:22px;
              "
            >
              <div style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                <div style="font-size:12px; color:#6b7280; text-transform:uppercase;">Employé</div>
                <div style="font-size:16px; font-weight:700; color:#111827;">
                  {{ selectedPayroll.employee?.firstName || '-' }} {{ selectedPayroll.employee?.lastName || '' }}
                </div>
              </div>

              <div style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:14px; padding:14px;">
                <div style="font-size:12px; color:#6b7280; text-transform:uppercase;">Matricule</div>
                <div style="font-size:16px; font-weight:700; color:#111827;">
                  {{ selectedPayroll.employee?.matricule || '-' }}
                </div>
              </div>
            </div>

            <div
              style="
                display:grid;
                grid-template-columns:repeat(2,minmax(0,1fr));
                gap:18px;
              "
            >
              <div style="border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
                <div style="padding:14px 16px; background:#f8fafc; font-weight:700;">Gains</div>
                <div style="padding:0 16px 16px;">
                  <p><strong>Salaire de base :</strong> {{ selectedPayroll.baseSalary | number:'1.2-2' }}</p>
                  <p><strong>Prime :</strong> {{ selectedPayroll.bonus | number:'1.2-2' }}</p>
                  <p><strong>Indemnité :</strong> {{ selectedPayroll.allowance | number:'1.2-2' }}</p>
                  <p><strong>Heures sup. :</strong> {{ selectedPayroll.overtimeAmount | number:'1.2-2' }}</p>
                  <p><strong>Salaire brut :</strong> {{ selectedPayroll.grossSalary | number:'1.2-2' }}</p>
                </div>
              </div>

              <div style="border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
                <div style="padding:14px 16px; background:#f8fafc; font-weight:700;">Retenues</div>
                <div style="padding:0 16px 16px;">
                  <p><strong>Retenues :</strong> {{ selectedPayroll.deductions | number:'1.2-2' }}</p>
                  <p><strong>Cotisations :</strong> {{ selectedPayroll.contributions | number:'1.2-2' }}</p>
                  <p><strong>Statut :</strong> {{ getValidationStatusLabel(selectedPayroll.validationStatus) }}</p>
                  <p><strong>Généré le :</strong> {{ selectedPayroll.generatedAt | date:'yyyy-MM-dd HH:mm' }}</p>
                </div>
              </div>
            </div>

            <div
              style="
                margin-top:22px;
                padding:18px 20px;
                border-radius:18px;
                background:linear-gradient(135deg,#ecfdf5,#d1fae5);
                border:1px solid #a7f3d0;
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:16px;
                flex-wrap:wrap;
              "
            >
              <div style="font-size:15px; font-weight:700; color:#065f46;">Salaire net à payer</div>
              <div style="font-size:30px; font-weight:800; color:#047857;">
                {{ selectedPayroll.netSalary | number:'1.2-2' }}
              </div>
            </div>
          </div>
        </div>

        <div data-html2canvas-ignore="true" style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn-primary" type="button" (click)="downloadPayslipPdf(selectedPayroll)">
            Télécharger PDF
          </button>
          <button class="btn-secondary" type="button" (click)="previewPayslip(selectedPayroll)">
            Ouvrir / Imprimer
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .payrolls-page {
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
      background: linear-gradient(135deg, #0f766e, #0d9488, #14b8a6);
      color: white;
      box-shadow: 0 18px 40px rgba(20, 184, 166, 0.22);
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: 30px;
      font-weight: 700;
    }

    .hero p {
      margin: 0;
      opacity: 0.95;
      line-height: 1.5;
    }

    .hero-badge {
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 10px 14px;
      border-radius: 14px;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .stat-card,
    .card {
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
      grid-template-columns: 1fr 1.4fr;
      gap: 24px;
      align-items: start;
    }

    .grid {
      display: grid;
      gap: 16px;
    }

    .grid-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 14px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .form-group input,
    .form-group select,
    .search-box input {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 14px;
      padding: 12px 14px;
      outline: none;
      background: #fff;
    }

    .search-box {
      margin-bottom: 18px;
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
    .btn-action,
    .btn-edit,
    .btn-danger {
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0f766e, #0d9488);
      color: white;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #111827;
    }

    .btn-action {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .btn-edit {
      background: #ecfeff;
      color: #0f766e;
    }

    .btn-danger {
      background: #fef2f2;
      color: #b91c1c;
    }

    .alert {
      border-radius: 14px;
      padding: 14px 16px;
      font-size: 14px;
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
      padding: 14px 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
      vertical-align: middle;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }

    .badge-draft {
      background: #f3f4f6;
      color: #374151;
    }

    .badge-approved {
      background: #ecfdf5;
      color: #047857;
    }

    .badge-rejected {
      background: #fef2f2;
      color: #b91c1c;
    }

    .badge-paid {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .badge-unknown {
      background: #f9fafb;
      color: #6b7280;
    }

    .table-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .empty {
      text-align: center;
      color: #6b7280;
      padding: 20px;
    }

    .payslip-card {
      border: 2px dashed #cbd5e1;
    }

    @media (max-width: 1100px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid,
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PayrollsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly payrollsService = inject(PayrollsService);
  private readonly employeeService = inject(EmployeeService);
  private readonly auth = inject(AuthService);

  @ViewChild('payslipContent') payslipContent?: ElementRef<HTMLDivElement>;

  items: Payroll[] = [];
  employees: Employee[] = [];
  selectedPayroll: Payroll | null = null;

  companyName = 'MediSys Consulting';
  companyAddress = 'Tunis, Tunisie';
  companyEmail = 'contact@medisys-consulting.com';
  companyPhone = '+216 71 906 170';
  companyLogoUrl = 'assets/logo.png';

  editingId: string | null = null;
  loading = false;
  message = '';
  errorMessage = '';

  isEmployee = false;
  currentEmployeeId = '';

  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      return this.items;
    }

    return this.items.filter((p) =>
      ((p.employee?.firstName || '') + ' ' + (p.employee?.lastName || '')).toLowerCase().includes(term) ||
      (String(p.month) + '/' + String(p.year)).toLowerCase().includes(term) ||
      (p.employee?.matricule || '').toLowerCase().includes(term)
    );
  });

  form = this.fb.nonNullable.group({
    employeeId: ['', Validators.required],
    month: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    year: [2026, [Validators.required]],
    bonus: [0, Validators.required],
    allowance: [0, Validators.required],
    overtimeAmount: [0, Validators.required],
    deductions: [0, Validators.required],
    contributions: [0, Validators.required]
  });

  constructor() {
    this.loadCurrentUser();
  }

  getValidationStatusLabel(status: number | string | null | undefined): string {
    if (status === null || status === undefined) return 'Inconnu';

    if (typeof status === 'string') {
      const s = status.toLowerCase();

      if (s === 'draft') return 'Brouillon';
      if (s === 'validated') return 'Validée';
      if (s === 'approved') return 'Approuvée';
      if (s === 'rejected') return 'Rejetée';
      if (s === 'paid') return 'Payée';

      return status;
    }

    switch (status) {
      case 0: return 'Brouillon';
      case 1: return 'Validée';
      case 2: return 'Rejetée';
      case 3: return 'Payée';
      default: return 'Inconnu';
    }
  }

  getValidationStatusClass(status: number | string | null | undefined): string {
    if (status === null || status === undefined) return 'badge-unknown';

    if (typeof status === 'string') {
      const s = status.toLowerCase();

      if (s === 'draft') return 'badge-draft';
      if (s === 'validated' || s === 'approved') return 'badge-approved';
      if (s === 'rejected') return 'badge-rejected';
      if (s === 'paid') return 'badge-paid';

      return 'badge-unknown';
    }

    switch (status) {
      case 0: return 'badge-draft';
      case 1: return 'badge-approved';
      case 2: return 'badge-rejected';
      case 3: return 'badge-paid';
      default: return 'badge-unknown';
    }
  }

  loadCurrentUser(): void {
    this.auth.me().subscribe({
      next: (user) => {
        this.isEmployee = user.roles.includes('Employee');
        this.currentEmployeeId = user.employeeId || '';

        if (this.isEmployee) {
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
      this.payrollsService.getMine().subscribe({
        next: (data: Payroll[]) => {
          this.items = data;
        },
        error: () => {
          this.errorMessage = 'Impossible de charger vos paies.';
        }
      });

      this.employees = [];
      return;
    }

    this.payrollsService.getAll().subscribe({
      next: (data: Payroll[]) => {
        this.items = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les paies.';
      }
    });

    this.employeeService.getAll().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
      },
      error: () => {}
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
      month: Number(raw.month),
      year: Number(raw.year),
      bonus: Number(raw.bonus),
      allowance: Number(raw.allowance),
      overtimeAmount: Number(raw.overtimeAmount),
      deductions: Number(raw.deductions),
      contributions: Number(raw.contributions)
    };

    if (this.editingId) {
      this.payrollsService.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Paie modifiée avec succès.';
          this.cancelEdit(false);
          this.loadAll();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Modification de paie impossible.';
        }
      });
    } else {
      this.payrollsService.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Paie créée avec succès.';
          this.resetForm();
          this.loadAll();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Création de paie impossible.';
        }
      });
    }
  }

  edit(payroll: Payroll): void {
    this.editingId = payroll.id;
    this.selectedPayroll = payroll;
    this.message = '';
    this.errorMessage = '';

    this.form.patchValue({
      employeeId: payroll.employeeId,
      month: Number(payroll.month),
      year: Number(payroll.year),
      bonus: Number(payroll.bonus),
      allowance: Number(payroll.allowance),
      overtimeAmount: Number(payroll.overtimeAmount),
      deductions: Number(payroll.deductions),
      contributions: Number(payroll.contributions)
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

  remove(payroll: Payroll): void {
    const fullName = (payroll.employee?.firstName || '') + ' ' + (payroll.employee?.lastName || '');
    const ok = confirm('Voulez-vous vraiment supprimer la paie de ' + fullName + ' pour ' + payroll.month + '/' + payroll.year + ' ?');

    if (!ok) {
      return;
    }

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.payrollsService.delete(payroll.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Paie supprimée avec succès.';

        if (this.editingId === payroll.id) {
          this.cancelEdit(false);
        }

        if (this.selectedPayroll?.id === payroll.id) {
          this.selectedPayroll = null;
        }

        this.loadAll();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Suppression de paie impossible.';
      }
    });
  }

  showPayslip(payroll: Payroll): void {
    this.selectedPayroll = payroll;
  }

  previewPayslip(payroll: Payroll): void {
    this.openPayslipWindow(payroll, false);
  }

  async downloadPayslipPdf(payroll: Payroll): Promise<void> {
    this.selectedPayroll = payroll;

    await new Promise(resolve => setTimeout(resolve, 200));

    const element = this.payslipContent?.nativeElement;
    if (!element) {
      this.errorMessage = 'Impossible de générer le PDF.';
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 8;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }

      const employeeName =
        `${payroll.employee?.firstName || ''} ${payroll.employee?.lastName || ''}`.trim() || 'Employe';

      const safeName = employeeName.replace(/\s+/g, '-');
      pdf.save(`fiche-paie-${safeName}-${payroll.month}-${payroll.year}.pdf`);
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Erreur lors de la génération du PDF.';
    }
  }

  private openPayslipWindow(payroll: Payroll, autoPrint: boolean): void {
    const employeeName =
      `${payroll.employee?.firstName || ''} ${payroll.employee?.lastName || ''}`.trim() || 'Employé';
    const matricule = payroll.employee?.matricule || '-';
    const generatedAt = payroll.generatedAt ? new Date(payroll.generatedAt).toLocaleString() : '-';
    const logoUrl = `${window.location.origin}/${this.companyLogoUrl}`;
    const validationStatusLabel = this.getValidationStatusLabel(payroll.validationStatus);

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Fiche de paie - ${employeeName}</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f5f7fb;
            margin: 0;
            padding: 30px;
            color: #1f2937;
          }
          .sheet {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
            border: 1px solid #e5e7eb;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            padding: 28px 32px;
            background: linear-gradient(135deg, #0f172a, #1d4ed8);
            color: white;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 18px;
          }
          .logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
            background: white;
            border-radius: 14px;
            padding: 8px;
          }
          .company-name {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .company-meta {
            margin-top: 6px;
            font-size: 13px;
            opacity: 0.92;
            line-height: 1.5;
          }
          .header-right {
            text-align: right;
          }
          .header-right h2 {
            margin: 0;
            font-size: 26px;
          }
          .header-right p {
            margin: 8px 0 0;
            font-size: 13px;
            opacity: 0.95;
          }
          .section {
            padding: 28px 32px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }
          .info-card {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 14px 16px;
          }
          .label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 6px;
          }
          .value {
            font-size: 15px;
            font-weight: 700;
            color: #111827;
          }
          .tables {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px;
          }
          .table-box {
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
          }
          .table-title {
            margin: 0;
            padding: 14px 16px;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
            font-size: 16px;
            font-weight: 700;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
          }
          td:last-child {
            text-align: right;
            font-weight: 700;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .net-box {
            margin-top: 28px;
            padding: 20px 22px;
            border-radius: 18px;
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border: 1px solid #a7f3d0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
          }
          .net-label {
            font-size: 15px;
            color: #065f46;
            font-weight: 700;
          }
          .net-value {
            font-size: 30px;
            font-weight: 800;
            color: #047857;
          }
          .footer {
            padding: 18px 32px 28px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .sheet {
              box-shadow: none;
              border: none;
              border-radius: 0;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="header">
            <div class="header-left">
              <img src="${logoUrl}" alt="Logo" class="logo" />
              <div>
                <h1 class="company-name">${this.companyName}</h1>
                <div class="company-meta">
                  ${this.companyAddress}<br>
                  ${this.companyEmail}<br>
                  ${this.companyPhone}
                </div>
              </div>
            </div>

            <div class="header-right">
              <h2>Fiche de paie</h2>
              <p>Période : ${payroll.month}/${payroll.year}</p>
              <p>Générée le : ${generatedAt}</p>
            </div>
          </div>

          <div class="section">
            <div class="info-grid">
              <div class="info-card">
                <div class="label">Employé</div>
                <div class="value">${employeeName}</div>
              </div>

              <div class="info-card">
                <div class="label">Matricule</div>
                <div class="value">${matricule}</div>
              </div>
            </div>

            <div class="tables">
              <div class="table-box">
                <h3 class="table-title">Gains</h3>
                <table>
                  <tr><td>Salaire de base</td><td>${payroll.baseSalary}</td></tr>
                  <tr><td>Prime</td><td>${payroll.bonus}</td></tr>
                  <tr><td>Indemnité</td><td>${payroll.allowance}</td></tr>
                  <tr><td>Heures sup.</td><td>${payroll.overtimeAmount}</td></tr>
                  <tr><td>Salaire brut</td><td>${payroll.grossSalary}</td></tr>
                </table>
              </div>

              <div class="table-box">
                <h3 class="table-title">Retenues</h3>
                <table>
                  <tr><td>Retenues</td><td>${payroll.deductions}</td></tr>
                  <tr><td>Cotisations</td><td>${payroll.contributions}</td></tr>
                  <tr><td>Statut</td><td>${validationStatusLabel}</td></tr>
                </table>
              </div>
            </div>

            <div class="net-box">
              <div class="net-label">Salaire net à payer</div>
              <div class="net-value">${payroll.netSalary}</div>
            </div>
          </div>

          <div class="footer">
            Document généré automatiquement par ${this.companyName}.
          </div>
        </div>

        ${autoPrint ? `
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        ` : ''}
      </body>
      </html>
    `;

    const win = window.open('', '_blank', 'width=1000,height=900');
    if (!win) return;

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  private resetForm(): void {
    this.form.reset({
      employeeId: this.isEmployee ? this.currentEmployeeId : '',
      month: 1,
      year: 2026,
      bonus: 0,
      allowance: 0,
      overtimeAmount: 0,
      deductions: 0,
      contributions: 0
    });
  }
}