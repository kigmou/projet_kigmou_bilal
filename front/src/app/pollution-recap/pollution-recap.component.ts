import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { PollutionDeclaration } from '../pollution.model';

@Component({
  selector: 'app-pollution-recap',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './pollution-recap.component.html',
  styleUrl: './pollution-recap.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionRecapComponent {
  @Input({ required: true }) declaration!: PollutionDeclaration;
  @Output() readonly edit = new EventEmitter<void>();

  imageFailed = false;

  hideBrokenImage(): void {
    this.imageFailed = true;
  }
}
