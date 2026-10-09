import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PollutionFormComponent } from './pollution-form/pollution-form.component';
import { PollutionRecapComponent } from './pollution-recap/pollution-recap.component';
import { PollutionDeclaration } from './pollution.model';

@Component({
  selector: 'app-root',
  imports: [PollutionFormComponent, PollutionRecapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  declaration: PollutionDeclaration | null = null;

  showRecap(declaration: PollutionDeclaration): void {
    this.declaration = declaration;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editDeclaration(): void {
    this.declaration = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
