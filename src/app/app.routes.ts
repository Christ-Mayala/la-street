import { Routes } from '@angular/router';
import { HomePage } from './features/pages/home/home';
import { SearchPage } from './features/pages/search/search';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'search', component: SearchPage },
  { path: 'contact', loadComponent: () => import('./features/pages/contact/contact').then(m => m.ContactPage) },
  { path: 'about', loadComponent: () => import('./features/pages/about/about').then(m => m.AboutPage) },
  { path: 'professional/:id', loadComponent: () => import('./features/pages/professional-profile/professional-profile').then(m => m.ProfessionalProfilePage) },
  { path: 'messages', loadComponent: () => import('./features/pages/messages/messages').then(m => m.MessagesPage) },
  { path: 'favorites', loadComponent: () => import('./features/pages/favorites/favorites').then(m => m.FavoritesPage) },
  { path: 'profile', loadComponent: () => import('./features/pages/profile/profile').then(m => m.ProfilePage) },
  { path: 'admin', loadComponent: () => import('./features/pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardPage), canActivate: [AdminGuard] },
  { path: 'login', loadComponent: () => import('./features/pages/login/login').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./features/pages/register/register').then(m => m.RegisterPage) },
  { path: '**', redirectTo: '' }
];
