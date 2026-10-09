import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { POLLUTION_TYPES, PollutionDeclaration, PollutionType } from '../pollution.model';

function validObservationDate(control: AbstractControl<string | null>): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const parts = control.value.split('-').map(Number);
  if (parts.length !== 3) {
    return { invalidDate: true };
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!isRealDate) {
    return { invalidDate: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today ? { futureDate: true } : null;
}

function optionalHttpUrl(control: AbstractControl<string | null>): ValidationErrors | null {
  const value = control.value?.trim();
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? null : { invalidUrl: true };
  } catch {
    return { invalidUrl: true };
  }
}

@Component({
  selector: 'app-pollution-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.component.html',
  styleUrl: './pollution-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionFormComponent {
  @Output() readonly declared = new EventEmitter<PollutionDeclaration>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly pollutionTypes = POLLUTION_TYPES;
  readonly today = this.toLocalDateInputValue(new Date());
  submitted = false;

  readonly pollutionForm = this.formBuilder.group({
    title: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    observationDate: ['', [Validators.required, validObservationDate]],
    location: ['', Validators.required],
    latitude: [null as number | null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null as number | null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    photoUrl: ['', optionalHttpUrl]
  });

  isInvalid(controlName: string): boolean {
    const control = this.pollutionForm.get(controlName);
    return Boolean(control?.invalid && (control.touched || this.submitted));
  }

  hasError(controlName: string, errorName: string): boolean {
    return Boolean(this.pollutionForm.get(controlName)?.hasError(errorName));
  }

  onSubmit(): void {
    this.submitted = true;
    this.pollutionForm.markAllAsTouched();

    if (this.pollutionForm.invalid) {
      this.focusFirstInvalidField();
      return;
    }

    const value = this.pollutionForm.getRawValue();
    this.declared.emit({
      title: value.title!.trim(),
      type: value.type as PollutionType,
      description: value.description!.trim(),
      observationDate: value.observationDate!,
      location: value.location!.trim(),
      latitude: Number(value.latitude),
      longitude: Number(value.longitude),
      photoUrl: value.photoUrl!.trim()
    });
  }

  private focusFirstInvalidField(): void {
    queueMicrotask(() => {
      this.elementRef.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }

  private toLocalDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
