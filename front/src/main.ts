import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, { providers: [provideHttpClient(), provideRouter(routes)] }).catch((error: unknown) => console.error(error));
