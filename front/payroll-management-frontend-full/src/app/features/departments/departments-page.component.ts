import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../models/department.models';

@Component({
  selector: 'app-departments-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host {
      display: block;
    }

    .departments-page {
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
      grid-template-columns: 1fr 1.25fr;
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .form-group input,
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
    .form-group textarea:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.12);
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
    .btn-danger,
    .btn-edit {
      border: none;
      border-radius: 14px;
      padding: 12px 18px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #0f766e, #0d9488);
      color: white;
      box-shadow: 0 10px 22px rgba(13, 148, 136, 0.22);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(13, 148, 136, 0.25);
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
      background: #f9fbff;
    }

    .department-name {
      font-weight: 700;
      color: #111827;
    }

    .department-desc {
      color: #6b7280;
      line-height: 1.5;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: #ecfeff;
      color: #0f766e;
      font-size: 12px;
      font-weight: 700;
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
      .stats-grid {
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
    <section class="departments-page">
      <div class="hero">
        <div>
          <h1>Gestion des départements</h1>
          <p>
            Organise les services de l’entreprise dans une interface moderne,
            claire et professionnelle adaptée à une plateforme RH et paie.
          </p>
        </div>
        <div class="hero-badge">CRUD complet</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total départements</div>
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
            {{ editingId ? 'Modifier un département' : 'Ajouter un département' }}
          </h2>
          <p class="panel-subtitle">
            {{ editingId
              ? 'Modifie les informations du département sélectionné.'
              : 'Crée un nouveau service ou une nouvelle unité organisationnelle.' }}
          </p>

          <div *ngIf="message" class="alert alert-success">{{ message }}</div>
          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-group">
              <label>Nom du département</label>
              <input formControlName="name" placeholder="Ressources Humaines" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                formControlName="description"
                rows="6"
                placeholder="Description du service, missions principales..."
              ></textarea>
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
                {{ loading
                  ? (editingId ? 'Modification...' : 'Ajout en cours...')
                  : (editingId ? 'Modifier le département' : 'Ajouter le département') }}
              </button>
            </div>
          </form>
        </div>

        <div class="panel">
          <h2 class="panel-title">Liste des départements</h2>
          <p class="panel-subtitle">Consulte, modifie ou supprime les départements enregistrés.</p>

          <div class="toolbar">
            <div class="search-box">
              <input
                type="text"
                [value]="searchTerm()"
                (input)="searchTerm.set(($any($event.target).value || '').trim())"
                placeholder="Rechercher par nom ou description..."
              />
            </div>
          </div>

          <div class="table-wrapper" *ngIf="filteredItems().length > 0; else emptyTpl">
            <table>
              <thead>
                <tr>
                  <th>Département</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of filteredItems()">
                  <td>
                    <div class="department-name">{{ d.name }}</div>
                  </td>
                  <td>
                    <div class="department-desc">{{ d.description || '-' }}</div>
                  </td>
                  <td>
                    <span class="badge">Actif</span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-edit" type="button" (click)="edit(d)">
                        Modifier
                      </button>
                      <button class="btn-danger" type="button" (click)="remove(d)">
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
              Aucun département trouvé pour le moment.
            </div>
          </ng-template>
        </div>
      </div>
    </section>
  `
})
export class DepartmentsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(DepartmentService);

  items: Department[] = [];
  loading = false;
  message = '';
  errorMessage = '';
  editingId: string | null = null;

  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.items;

    return this.items.filter(d =>
      d.name.toLowerCase().includes(term) ||
      (d.description || '').toLowerCase().includes(term)
    );
  });

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: data => {
        this.items = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les départements.';
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    const payload = this.form.getRawValue();

    if (this.editingId) {
      this.service.update(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Département modifié avec succès.';
          this.cancelEdit(false);
          this.load();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Modification impossible.';
        }
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Département ajouté avec succès.';
          this.form.reset({ name: '', description: '' });
          this.load();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Ajout impossible.';
        }
      });
    }
  }

  edit(department: Department): void {
    this.editingId = department.id;
    this.message = '';
    this.errorMessage = '';

    this.form.patchValue({
      name: department.name,
      description: department.description || ''
    });
  }

  cancelEdit(clearMessage: boolean = true): void {
    this.editingId = null;
    this.form.reset({ name: '', description: '' });

    if (clearMessage) {
      this.message = '';
      this.errorMessage = '';
    }
  }

  remove(department: Department): void {
    const ok = confirm(`Voulez-vous vraiment supprimer le département "${department.name}" ?`);
    if (!ok) return;

    this.loading = true;
    this.message = '';
    this.errorMessage = '';

    this.service.delete(department.id).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Département supprimé avec succès.';

        if (this.editingId === department.id) {
          this.cancelEdit(false);
        }

        this.load();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Suppression impossible.';
      }
    });
  }
}