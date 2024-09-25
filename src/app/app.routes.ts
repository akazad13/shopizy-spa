import { Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';

export const routes: Routes = [
    {
        path: '',
        component: RootComponent,
        data: {
            desktopHeader: 'classic/two'
        }
    }
];
