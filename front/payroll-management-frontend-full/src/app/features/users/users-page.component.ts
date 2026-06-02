import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../models/employee.models';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <h1 class="page-title">Comptes utilisateurs</h1>
      <p class="page-subtitle">Le backend fourni permet surtout la création de comptes et la récupération du profil connecté.</p>

      <div *ngIf="message" class="alert alert-success">{{ message }}</div>
      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <div class="grid grid-2">
        <div class="card">
          <h3>Créer un compte</h3>
          <form [formGroup]="form" (ngSubmit)="create()">
            <div class="form-group"><label>Nom complet</label><input formControlName="fullName"></div>
            <div class="grid grid-2">
              <div class="form-group"><label>Email</label><input formControlName="email"></div>
              <div class="form-group"><label>Mot de passe</label><input type="password" formControlName="password"></div>
            </div>
            <div class="grid grid-2">
              <div class="form-group">
                <label>Rôle</label>
                <select formControlName="role">
                  <option value="RH">RH</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Employé lié</label>
                <select formControlName="employeeId">
                  <option value="">Aucun</option>
                  <option *ngFor="let e of employees" [value]="e.id">{{ e.firstName }} {{ e.lastName }}</option>
                </select>
              </div>
            </div>
            <button class="btn-primary" [disabled]="form.invalid || loading">{{ loading ? 'Création...' : 'Créer le compte' }}</button>
          </form>
        </div>

        <div class="card">
          <h3>Mon compte</h3>
          <div *ngIf="me; else loadingTpl">
            <p><strong>Nom :</strong> {{ me.fullName }}</p>
            <p><strong>Email :</strong> {{ me.email }}</p>
            <p><strong>Rôles :</strong> {{ me.roles.join(', ') }}</p>
          </div>
          <ng-template #loadingTpl>
            <div class="small">Chargement du profil...</div>
          </ng-template>
          <p class="small" style="margin-top:16px">
            Le backend ZIP ne contient pas d’endpoint pour lister tous les utilisateurs. Cette page est donc alignée au backend réel : création + profil connecté.
          </p>
        </div>
      </div>
    </section>
  `
})
export class UsersPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly employeesService = inject(EmployeeService);

  employees: Employee[] = [];
  me: { fullName: string; email: string; roles: string[] } | null = null;
  loading = false;
  message = '';
  errorMessage = '';

  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['RH', Validators.required],
    employeeId: ['']
  });

  constructor() {
    this.auth.me().subscribe({ next: v => this.me = v, error: () => {} });
    this.employeesService.getAll().subscribe({ next: data => this.employees = data, error: () => {} });
  }

  create(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const raw = this.form.getRawValue();
    this.auth.register({
      ...raw,
      employeeId: raw.employeeId || null
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res.message || 'Compte créé avec succès.';
        this.form.reset({ fullName: '', email: '', password: '', role: 'RH', employeeId: '' });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Création du compte impossible.';
      }
    });
  }
}
