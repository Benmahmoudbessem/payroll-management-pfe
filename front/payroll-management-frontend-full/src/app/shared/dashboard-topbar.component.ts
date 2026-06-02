import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <h2 class="topbar-title">Dashboard</h2>
        <p class="topbar-subtitle">Bienvenue dans votre espace</p>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding: 18px 22px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 22px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
    }

    .topbar-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .topbar-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }

    .topbar-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    @media (max-width: 700px) {
      .topbar {
        padding: 16px 18px;
      }

      .topbar-title {
        font-size: 20px;
      }

      .topbar-subtitle {
        font-size: 13px;
      }
    }
  `]
})
export class DashboardTopbarComponent {}