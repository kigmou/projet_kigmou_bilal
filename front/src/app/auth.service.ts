import { Injectable } from '@angular/core';

const PROFILE_KEY = 'ecosignal.profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(PROFILE_KEY));
  }

  setProfile(profile: { name: string; email: string }): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  clearProfile(): void {
    localStorage.removeItem(PROFILE_KEY);
  }
}
