import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { LoginComponent } from './login/login.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the login form', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('LOGIN');
    expect(compiled.querySelector('form')).toBeTruthy();
  });

  it('should display the submitted data after validation', async () => {
    const fixture = TestBed.createComponent(App);
    const loginComponent = fixture.debugElement.query(By.directive(LoginComponent))
      .componentInstance as LoginComponent;

    loginComponent.login = {
      nom: 'Dupont',
      prenom: 'Alice',
      email: 'alice@example.com',
      password: 'secret',
      confirmpassword: 'secret',
    };
    loginComponent.submit();
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('.submitted-data') as HTMLElement;
    expect(summary.textContent).toContain('Dupont');
    expect(summary.textContent).toContain('Alice');
    expect(summary.textContent).toContain('alice@example.com');
    expect(summary.textContent).not.toContain('secret');
  });

  it('should refuse different passwords', () => {
    const fixture = TestBed.createComponent(App);
    const loginComponent = fixture.debugElement.query(By.directive(LoginComponent))
      .componentInstance as LoginComponent;

    loginComponent.login = {
      nom: 'Dupont',
      prenom: 'Alice',
      email: 'alice@example.com',
      password: 'premier-secret',
      confirmpassword: 'autre-secret',
    };
    loginComponent.submit();

    expect(loginComponent.passwordsMatch).toBe(false);
    expect(loginComponent.submittedData).toBeNull();
  });
});
