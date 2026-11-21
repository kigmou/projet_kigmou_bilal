import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="route-card" aria-labelledby="dashboard-title">
      <p class="eyebrow">Navigation sécurisée</p>
      <h1 id="dashboard-title">Tableau de bord</h1>
      <p>Votre espace de suivi est protégé par un guard et chargé à la demande.</p>
      <a href="/">Retour aux signalements</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
