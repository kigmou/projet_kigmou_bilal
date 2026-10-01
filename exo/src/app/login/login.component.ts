import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface LoginData {
  email: string;
  password: string;
  confirmpassword: string;
  nom: string;
  prenom: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  login: LoginData = {
    email: '',
    password: '',
    confirmpassword: '',
    nom: '',
    prenom: '',
  };

  submittedData: LoginData | null = null;

  get passwordsMatch(): boolean {
    return this.login.password === this.login.confirmpassword;
  }

  submit(): void {
    if (!this.passwordsMatch) {
      return;
    }

    this.submittedData = { ...this.login };
  }
}
