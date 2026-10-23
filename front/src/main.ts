import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AppComponent } from './app/app.component';

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, { providers: [provideHttpClient()] }).catch((error: unknown) => console.error(error));
