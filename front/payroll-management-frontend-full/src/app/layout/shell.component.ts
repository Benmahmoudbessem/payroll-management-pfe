import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { EmployeeService } from '../core/services/employee.service';
import { NotificationsService } from '../core/services/notifications.service';
import { NotificationItem } from '../models/notification.models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout" [class.dark-mode]="isDarkMode">
      <aside class="sidebar">
        <div class="sidebar-logo-box">
          <img src="assets/logo.png" alt="Logo" class="sidebar-logo" />
        </div>

        <nav class="menu">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>

          <ng-container *ngIf="isEmployee; else adminMenu">
            <a routerLink="/employee-space" routerLinkActive="active">Mon espace</a>
            <a routerLink="/notifications" routerLinkActive="active">Notifications</a>
            <a routerLink="/leave-requests" routerLinkActive="active">Demandes de congé</a>
            <a routerLink="/payrolls" routerLinkActive="active">Mes paies</a>
          </ng-container>

          <ng-template #adminMenu>
            <a routerLink="/departments" routerLinkActive="active">Départements</a>
            <a routerLink="/employees" routerLinkActive="active">Employés</a>
            <a routerLink="/contracts" routerLinkActive="active">Contrats</a>
            <a routerLink="/leave-requests" routerLinkActive="active">Demandes de congé</a>
            <a routerLink="/payrolls" routerLinkActive="active">Paies</a>
            <a routerLink="/predictions" routerLinkActive="active">Prédictions</a>
            <a routerLink="/notifications" routerLinkActive="active">Notifications</a>
            <a routerLink="/users" routerLinkActive="active">Comptes utilisateurs</a>
            <a routerLink="/anomalies" routerLinkActive="active">Anomalies</a>
          </ng-template>
        </nav>
      </aside>

      <main class="main">
        <div class="topbar card">
          <div class="topbar-left">
            <div class="page-title">Bienvenue</div>
          </div>

          <div class="topbar-right">
            <button class="theme-toggle" type="button" (click)="toggleDarkMode()">
              {{ isDarkMode ? '☀️ Mode clair' : '🌙 Mode sombre' }}
            </button>

            <div class="notif-wrapper">
              <button
                class="notif-btn"
                [class.ring]="bellAnimate"
                (click)="toggleNotifications($event)"
                type="button"
              >
                <svg viewBox="0 0 24 24" class="notif-icon" aria-hidden="true">
                  <path
                    d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
                    fill="currentColor"
                  />
                </svg>

                <span *ngIf="unreadCount > 0" class="notif-badge" [class.pulse]="bellAnimate">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </button>

              <div class="notif-dropdown" [class.open]="notificationsOpen">
                <div class="dropdown-header">
                  <strong>Notifications</strong>
                  <span class="dropdown-count">{{ unreadCount }} non lue(s)</span>
                </div>

                <div *ngIf="notifications.length === 0" class="empty-state">
                  Aucune notification.
                </div>

                <div *ngIf="notifications.length > 0" class="notif-list">
                 <div class="notif-item" *ngFor="let n of notifications.slice(0, 6)">
  <div class="notif-header">
    <div class="notif-item-title">{{ n.title }}</div>

   <button
  class="delete-btn"
  type="button"
  (click)="deleteNotification(n.id, $event)"
>
  ✕
</button>
  </div>

  <div class="notif-item-message">{{ n.message }}</div>

  <div class="notif-item-date">
    {{ n.sentAt | date:'yyyy-MM-dd HH:mm' }}
  </div>
</div>
                </div>

                <div class="dropdown-footer">
                  <button class="see-all-btn" type="button" (click)="goToNotifications()">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            </div>

            <div class="profile-box">
              <img
                [src]="photoUrl || defaultAvatarUrl"
                alt="Profil"
                class="profile-image"
              />

              <div class="profile-meta">
                <div class="profile-name">{{ displayName }}</div>
                <div class="profile-role">{{ roleLabel }}</div>
                <div class="profile-email">{{ emailDisplay }}</div>
              </div>
            </div>

            <button class="btn-danger" type="button" (click)="logout()">Déconnexion</button>
          </div>
        </div>

        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f8fafc;
    }

    .layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 100vh;
      transition: background 0.25s ease, color 0.25s ease;
    }

    .sidebar {
      background: linear-gradient(180deg, #0f172a, #111827);
      color: white;
      padding: 24px 18px;
      border-right: 1px solid rgba(255,255,255,0.06);
    }

    .sidebar-logo-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 28px;
      padding: 8px 10px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .sidebar-logo {
      width: 180px;
      max-width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
    }

    .menu {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .menu a {
      text-decoration: none;
      color: #e5e7eb;
      padding: 12px 14px;
      border-radius: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .menu a:hover {
      background: rgba(255,255,255,0.08);
      color: white;
    }

    .menu a.active {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      box-shadow: 0 10px 22px rgba(37, 99, 235, 0.25);
    }

    .main {
      padding: 24px;
      overflow-x: auto;
      background: #f8fafc;
      transition: background 0.25s ease;
    }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
      transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
      margin-bottom: 24px;
      padding: 18px 20px;
      flex-wrap: wrap;
    }

    .topbar-left {
      min-width: 220px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 800;
      color: #111827;
      transition: color 0.25s ease;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      flex-wrap: wrap;
    }

    .theme-toggle {
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      background: #f3f4f6;
      color: #111827;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;
      border: 1px solid #e5e7eb;
    }

    .theme-toggle:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    .notif-wrapper {
      position: relative;
    }

    .notif-btn {
      position: relative;
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      background: #f3f4f6;
      color: #111827;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: 0.2s ease;
      transform-origin: top center;
    }

    .notif-btn:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    .notif-btn.ring {
      animation: bellRing 0.8s ease;
    }

    .notif-icon {
      width: 22px;
      height: 22px;
    }

    .notif-badge {
      position: absolute;
      top: -4px;
      right: -2px;
      min-width: 20px;
      height: 20px;
      border-radius: 999px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.35);
    }

    .notif-badge.pulse {
      animation: badgePulse 0.9s ease;
    }

    .notif-dropdown {
      position: absolute;
      top: 58px;
      right: 0;
      width: 360px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
      overflow: hidden;
      z-index: 100;
      opacity: 0;
      transform: translateY(-8px) scale(0.98);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease, background 0.25s ease, border-color 0.25s ease;
    }

    .notif-dropdown.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid #eef2f7;
      background: #f8fafc;
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    .dropdown-count {
      font-size: 12px;
      color: #6b7280;
      transition: color 0.25s ease;
    }

    .notif-list {
      max-height: 340px;
      overflow-y: auto;
    }

    .notif-item {
      padding: 14px 16px;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.2s ease, border-color 0.25s ease;
    }

    .notif-item:hover {
      background: #f8fbff;
    }

    .notif-item:last-child {
      border-bottom: none;
    }

    .notif-item-title {
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
      transition: color 0.25s ease;
    }

    .notif-item-message {
      color: #4b5563;
      font-size: 13px;
      line-height: 1.45;
      margin-bottom: 6px;
      transition: color 0.25s ease;
    }

    .notif-item-date {
      font-size: 12px;
      color: #94a3b8;
      transition: color 0.25s ease;
    }

    .dropdown-footer {
      padding: 12px 16px;
      border-top: 1px solid #eef2f7;
      background: #fcfdff;
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    .see-all-btn {
      width: 100%;
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      background: #2563eb;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .see-all-btn:hover {
      background: #1d4ed8;
    }

    .empty-state {
      padding: 20px 16px;
      color: #6b7280;
      text-align: center;
      transition: color 0.25s ease;
    }

    .profile-box {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 220px;
    }

    .profile-image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e5e7eb;
      flex-shrink: 0;
      transition: border-color 0.25s ease;
    }

    .profile-meta {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .profile-name {
      font-size: 14px;
      font-weight: 700;
      color: #111827;
      transition: color 0.25s ease;
    }

    .profile-role {
      font-size: 12px;
      color: #6b7280;
      margin-top: 2px;
      transition: color 0.25s ease;
    }

    .profile-email {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 2px;
      transition: color 0.25s ease;
    }

    .btn-danger {
      border: none;
      border-radius: 12px;
      padding: 10px 14px;
      background: #ef4444;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    /* DARK MODE */
    .layout.dark-mode {
      background: #0f172a;
    }

    .layout.dark-mode .main {
      background: #0b1220;
    }

    .layout.dark-mode .card,
    .layout.dark-mode .notif-dropdown {
      background: #111827;
      border-color: #374151;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
    }

    .layout.dark-mode .page-title,
    .layout.dark-mode .profile-name,
    .layout.dark-mode .notif-item-title {
      color: #f8fafc;
    }

    .layout.dark-mode .profile-role,
    .layout.dark-mode .dropdown-count,
    .layout.dark-mode .notif-item-message,
    .layout.dark-mode .empty-state {
      color: #cbd5e1;
    }

    .layout.dark-mode .profile-email,
    .layout.dark-mode .notif-item-date {
      color: #94a3b8;
    }

    .layout.dark-mode .dropdown-header,
    .layout.dark-mode .dropdown-footer {
      background: #0f172a;
      border-color: #334155;
    }

    .layout.dark-mode .notif-item {
      border-color: #1f2937;
    }

    .layout.dark-mode .notif-item:hover {
      background: #1f2937;
    }

    .layout.dark-mode .notif-btn,
    .layout.dark-mode .theme-toggle {
      background: #1f2937;
      color: #f8fafc;
      border-color: #374151;
    }

    .layout.dark-mode .notif-btn:hover,
    .layout.dark-mode .theme-toggle:hover {
      background: #334155;
    }

    .layout.dark-mode .profile-image {
      border-color: #374151;
    }
    .notif-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
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

.layout.dark-mode .delete-btn {
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.45);
}
    @keyframes bellRing {
      0% { transform: rotate(0deg); }
      15% { transform: rotate(14deg); }
      30% { transform: rotate(-12deg); }
      45% { transform: rotate(10deg); }
      60% { transform: rotate(-8deg); }
      75% { transform: rotate(6deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes badgePulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
      50% { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        padding: 18px;
      }

      .main {
        padding: 18px;
      }

      .topbar {
        flex-direction: column;
        align-items: flex-start;
      }

      .topbar-right {
        width: 100%;
        justify-content: space-between;
      }
    }

    @media (max-width: 700px) {
      .notif-dropdown {
        width: 290px;
        right: -40px;
      }

      .profile-box {
        min-width: unset;
      }

      .sidebar-logo {
        width: 220px;
      }




    }
  `]
})
export class ShellComponent {
  public readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly notificationsService = inject(NotificationsService);

  isDarkMode = false;
  isEmployee = false;

  displayName = 'Utilisateur';
  roleLabel = 'Compte';
  emailDisplay = '';

  defaultAvatarUrl = 'assets/avatar.png';
  photoUrl = '';

  notifications: NotificationItem[] = [];
  unreadCount = 0;
  notificationsOpen = false;
  bellAnimate = false;

  notificationAudio = new Audio('assets/notification.mp3');

  constructor() {
    const savedTheme = localStorage.getItem('shell-dark-mode');
    this.isDarkMode = savedTheme === 'true';

    this.auth.currentUser$.subscribe((user) => {
      this.isEmployee = !!user?.roles?.includes('Employee');
    });

    this.loadProfileAndNotifications();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('shell-dark-mode', String(this.isDarkMode));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-wrapper')) {
      this.notificationsOpen = false;
    }
  }

  loadProfileAndNotifications(): void {
    this.auth.me().subscribe({
      next: (user) => {
        const roles = user.roles || [];
        const isAdminOrRh = roles.includes('Admin') || roles.includes('RH');

        this.roleLabel = roles.length > 0 ? roles.join(', ') : 'Utilisateur';
        this.emailDisplay = user.email || '';
        this.isEmployee = roles.includes('Employee');

        if (user.employeeId) {
          this.employeeService.getById(user.employeeId).subscribe({
            next: (employee) => {
              this.displayName = `${employee.firstName} ${employee.lastName}`;
              const employeeAny = employee as any;
              this.photoUrl = employeeAny.photoUrl || '';
            },
            error: () => {
              this.displayName = user.fullName || user.email || 'Utilisateur';
            }
          });
        } else {
          this.displayName = user.fullName || user.email || 'Utilisateur';
        }

        if (isAdminOrRh) {
          this.notificationsService.getAll().subscribe({
            next: (data) => {
              this.notifications = data;
              this.unreadCount = data.filter(x => !x.isRead).length;
            },
            error: () => {
              this.notifications = [];
              this.unreadCount = 0;
            }
          });
        } else if (user.employeeId) {
          this.notificationsService.getByEmployee(user.employeeId).subscribe({
            next: (data) => {
              this.notifications = data;
              this.unreadCount = data.filter(x => !x.isRead).length;
            },
            error: () => {
              this.notifications = [];
              this.unreadCount = 0;
            }
          });
        }

        this.notificationsService.startConnection(
          isAdminOrRh,
          isAdminOrRh ? undefined : (user.employeeId ?? undefined)
        ).catch(() => {});

        this.notificationsService.notificationReceived$.subscribe((notification) => {
          this.notifications = [notification, ...this.notifications];
          this.unreadCount = this.notifications.filter(x => !x.isRead).length;
          this.triggerNotificationEffect();
        });
      },
      error: () => {
        this.displayName = 'Utilisateur';
        this.roleLabel = 'Compte';
        this.emailDisplay = '';
      }
    });
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.notificationsOpen = !this.notificationsOpen;
  }

  goToNotifications(): void {
    this.notificationsOpen = false;
    this.router.navigate(['/notifications']);
  }

  triggerNotificationEffect(): void {
    this.bellAnimate = false;

    setTimeout(() => {
      this.bellAnimate = true;
    }, 20);

    setTimeout(() => {
      this.bellAnimate = false;
    }, 900);

    this.playNotificationSound();
  }

  playNotificationSound(): void {
    try {
      this.notificationAudio.currentTime = 0;
      this.notificationAudio.volume = 1;
      this.notificationAudio.play().catch((err) => {
        console.error('Lecture du son impossible :', err);
      });
    } catch (err) {
      console.error('Erreur audio :', err);
    }
  }
  deleteNotification(id: string, event: MouseEvent): void {
  event.stopPropagation();

  this.notificationsService.delete(id).subscribe({
    next: () => {
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.unreadCount = this.notifications.filter(x => !x.isRead).length;
    },
    error: (err) => {
      console.error('Erreur suppression notification', err);
    }
  });
}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('employeeId');
    this.router.navigate(['/login']);
  }
}