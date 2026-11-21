import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="route-card" aria-labelledby="register-title">
      <p class="eyebrow">Espace citoyen</p>
      <h1 id="register-title">Créer un profil</h1>
      <form (ngSubmit)="register()" #form="ngForm">
        <label>Nom <input name="name" [(ngModel)]="name" required></label>
        <label>E-mail <input name="email" [(ngModel)]="email" required type="email"></label>
        <button type="submit" [disabled]="form.invalid">Accéder au tableau de bord</button>
      </form>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  name = '';
  email = '';

  register(): void {
    this.auth.setProfile({ name: this.name.trim(), email: this.email.trim() });
    void this.router.navigate(['/dashboard']);
  }
}
