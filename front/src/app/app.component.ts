import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PollutionFormComponent } from './pollution-form/pollution-form.component';
import { PollutionRecapComponent } from './pollution-recap/pollution-recap.component';
import { PollutionDeclaration } from './pollution.model';
import { PollutionService } from './pollution.service';

@Component({
  selector: 'app-root',
  imports: [PollutionFormComponent, PollutionRecapComponent, DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly service = inject(PollutionService);
  declaration: PollutionDeclaration | null = null;
  pollutions: PollutionDeclaration[] = [];
  selected: PollutionDeclaration | null = null;
  search = '';
  typeFilter = '';
  message = '';
  readonly pollutionTypes = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  ngOnInit(): void { this.load(); }
  load(): void { this.service.getAll().subscribe({ next: data => this.pollutions = data, error: () => this.message = 'API indisponible. Lancez « npm run api » dans le dossier front.' }); }
  get filtered(): PollutionDeclaration[] {
    const query = this.search.trim().toLowerCase();
    return this.pollutions.filter(p => (!this.typeFilter || p.type === this.typeFilter) && (!query || `${p.title} ${p.location} ${p.description}`.toLowerCase().includes(query)));
  }
  save(declaration: PollutionDeclaration): void {
    const request = declaration.id ? this.service.update(declaration.id, declaration) : this.service.create(declaration);
    request.subscribe({ next: saved => { this.declaration = saved; this.load(); } });
  }
  remove(pollution: PollutionDeclaration): void {
    if (!pollution.id || !confirm(`Supprimer « ${pollution.title} » ?`)) return;
    this.service.delete(pollution.id).subscribe(() => { this.selected = null; this.load(); });
  }
  showDetail(pollution: PollutionDeclaration): void { this.service.getById(pollution.id!).subscribe(data => this.selected = data); }

  showRecap(declaration: PollutionDeclaration): void {
    this.save(declaration);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editDeclaration(): void {
    this.declaration = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
