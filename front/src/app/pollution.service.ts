import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PollutionDeclaration } from './pollution.model';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/pollutions`;

  getAll(): Observable<PollutionDeclaration[]> { return this.http.get<PollutionDeclaration[]>(this.apiUrl); }
  getById(id: number): Observable<PollutionDeclaration> { return this.http.get<PollutionDeclaration>(`${this.apiUrl}/${id}`); }
  create(pollution: PollutionDeclaration): Observable<PollutionDeclaration> { return this.http.post<PollutionDeclaration>(this.apiUrl, pollution); }
  update(id: number, pollution: PollutionDeclaration): Observable<PollutionDeclaration> { return this.http.put<PollutionDeclaration>(`${this.apiUrl}/${id}`, pollution); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
