import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppComponent {
  private readonly auth = inject(AuthService);

  constructor() {
    if (this.auth.isLoggedIn) {
      this.auth.me().subscribe({ error: () => this.auth.logout() });
    }
  }
}
