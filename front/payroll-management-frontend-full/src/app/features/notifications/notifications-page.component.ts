import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { NotificationItem } from '../../models/notification.models';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="notifications-page">
      <div class="hero">
        <div>
          <h1>Notifications</h1>
          <p>Messages et alertes envoyés par le système en temps réel.</p>
        </div>
        <div class="hero-badge">{{ isAdminOrRh ? 'Admin / RH' : 'Employé' }}</div>
      </div>

      <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <div class="content-grid">
        <div class="card">
          <h3>Liste des notifications</h3>

          <div class="notification-list" *ngIf="items.length > 0; else emptyTpl">
            <div
              class="notification-item"
              *ngFor="let n of items"
              [class.unread]="!n.isRead"
              (click)="selectNotification(n)"
            >
             <div class="notif-header">

  <div class="notif-title-section">
    <strong>{{ n.title }}</strong>
    <span class="badge">{{ n.type }}</span>
  </div>

  <button
    class="delete-btn"
    type="button"
    (click)="deleteNotification(n.id, $event)"
  >
    ✕
  </button>

</div>

              <div class="notif-meta">
                {{ n.sentAt | date:'yyyy-MM-dd HH:mm' }}
              </div>

              <div class="notif-employee" *ngIf="n.employee">
                {{ n.employee.firstName }} {{ n.employee.lastName }} - {{ n.employee.matricule }}
              </div>

              <div class="notif-message">
                {{ n.message }}
              </div>

              <div class="notif-status">
                {{ n.isRead ? 'Lu' : 'Non lu' }}
              </div>
            </div>
          </div>

          <ng-template #emptyTpl>
            <p>Aucune notification disponible.</p>
          </ng-template>
        </div>

        <div class="card" *ngIf="selected">
          <h3>Détail notification</h3>

          <p><strong>Titre :</strong> {{ selected.title }}</p>
          <p><strong>Type :</strong> {{ selected.type }}</p>
          <p><strong>Date :</strong> {{ selected.sentAt | date:'yyyy-MM-dd HH:mm' }}</p>

          <p *ngIf="selected.employee">
            <strong>Employé :</strong>
            {{ selected.employee.firstName }} {{ selected.employee.lastName }}
            - {{ selected.employee.matricule }}
          </p>

          <p><strong>Message :</strong> {{ selected.message }}</p>

          <button class="btn-primary" *ngIf="!selected.isRead" (click)="markSelectedAsRead()">
            Marquer comme lu
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .notifications-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
      padding: 28px;
      border-radius: 22px;
      background: linear-gradient(135deg, #1d4ed8, #2563eb, #60a5fa);
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
      line-height: 1.5;
      opacity: 0.95;
    }

    .hero-badge {
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 10px 14px;
      border-radius: 14px;
      font-weight: 600;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
    }

    .notification-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .notification-item {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 14px;
      cursor: pointer;
      background: #fff;
      transition: 0.2s ease;
    }

    .notification-item:hover {
      background: #f8fbff;
    }

    .notification-item.unread {
      border-left: 5px solid #2563eb;
      background: #f8fbff;
    }

    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .notif-meta,
    .notif-employee,
    .notif-status {
      font-size: 13px;
      color: #6b7280;
      margin-top: 6px;
    }

    .notif-message {
      margin-top: 8px;
      color: #111827;
      line-height: 1.5;
    }

    .badge {
      padding: 5px 10px;
      border-radius: 999px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 700;
    }

    .btn-primary {
      margin-top: 12px;
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      background: #2563eb;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    .alert-error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      padding: 12px;
      border-radius: 12px;
    }
    .notif-title-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.delete-btn {
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.22s ease;
  box-shadow: 0 6px 14px rgba(239, 68, 68, 0.28);
  flex-shrink: 0;

  font-size: 18px;
  font-weight: 900;
  line-height: 1;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px) scale(1.06);
  box-shadow: 0 10px 22px rgba(239, 68, 68, 0.4);
}

.delete-btn:active {
  transform: scale(0.94);
}

    @media (max-width: 900px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NotificationsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly service = inject(NotificationsService);

  items: NotificationItem[] = [];
  selected: NotificationItem | null = null;
  errorMessage = '';
  isAdminOrRh = false;
  employeeId = '';

  constructor() {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.auth.me().subscribe({
      next: (user) => {
       const roles = user.roles || [];

    this.isAdminOrRh =
    roles.includes('Admin') ||
    roles.includes('RH');

        this.employeeId = user.employeeId || '';

        this.loadNotifications();

        this.service.startConnection(
          this.isAdminOrRh,
          this.isAdminOrRh ? undefined : this.employeeId
        ).catch(() => {
          console.error('Erreur connexion SignalR');
        });

        this.service.notificationReceived$.subscribe((notification) => {
          this.items = [notification, ...this.items];
        });
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le compte connecté.';
      }
    });
  }

  loadNotifications(): void {
    if (this.isAdminOrRh) {
      this.service.getAll().subscribe({
        next: (data) => {
          this.items = data;
        },
        error: (err) => {
          console.error('Erreur getAll notifications :', err);
          this.errorMessage = 'Impossible de charger les notifications.';
        }
      });
    } else {
      if (!this.employeeId) {
        this.errorMessage = 'Aucun employeeId trouvé pour ce compte.';
        return;
      }

      this.service.getByEmployee(this.employeeId).subscribe({
        next: (data) => {
          this.items = data;
        },
        error: (err) => {
          console.error('Erreur getByEmployee notifications :', err);
          this.errorMessage = 'Impossible de charger les notifications.';
        }
      });
    }
  }

  selectNotification(notification: NotificationItem): void {
    this.selected = notification;
  }
  deleteNotification(id: string, event: MouseEvent): void {
  event.stopPropagation();

  this.service.delete(id).subscribe({
    next: () => {
      this.items = this.items.filter(x => x.id !== id);

      if (this.selected?.id === id) {
        this.selected = null;
      }
    },
    error: () => {
      this.errorMessage = 'Impossible de supprimer la notification.';
    }
  });
}

  markSelectedAsRead(): void {
    if (!this.selected) return;

    this.service.markAsRead(this.selected.id).subscribe({
      next: () => {
        this.selected = { ...this.selected!, isRead: true };
        this.items = this.items.map(item =>
          item.id === this.selected!.id ? { ...item, isRead: true } : item
        );
      },
      error: () => {
        this.errorMessage = 'Impossible de marquer la notification comme lue.';
      }
    });
  }
}