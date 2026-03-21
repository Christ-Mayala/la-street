import { Routes } from '@angular/router';
import { HomePage } from './features/pages/home/home';
import { SearchPage } from './features/pages/search/search';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'search', component: SearchPage },
  { path: 'contact', loadComponent: () => import('./features/pages/contact/contact').then(m => m.ContactPage) },
  { path: 'about', loadComponent: () => import('./features/pages/about/about').then(m => m.AboutPage) },
  { path: 'terms', loadComponent: () => import('./features/pages/terms/terms').then(m => m.TermsPage) },
  { path: 'privacy', loadComponent: () => import('./features/pages/privacy/privacy').then(m => m.PrivacyPage) },
  { path: 'forgot-password', loadComponent: () => import('./features/pages/forgot-password/forgot-password').then(m => m.ForgotPasswordPage) },
  { path: 'reset-verify', loadComponent: () => import('./features/pages/reset-verify/reset-verify').then(m => m.ResetVerifyPage) },
  { path: 'reset-password', loadComponent: () => import('./features/pages/reset-password/reset-password').then(m => m.ResetPasswordPage) },
  { path: 'reset-password/:token', loadComponent: () => import('./features/pages/reset-password/reset-password').then(m => m.ResetPasswordPage) },
  { path: 'professional/:id', loadComponent: () => import('./features/pages/professional-profile/professional-profile').then(m => m.ProProfilePage) },
  { path: 'messages', loadComponent: () => import('./features/pages/messages/messages').then(m => m.MessagesPage) },
  { path: 'favorites', loadComponent: () => import('./features/pages/favorites/favorites').then(m => m.FavoritesPage) },
  { path: 'profile', loadComponent: () => import('./features/pages/profile/profile').then(m => m.UserProfilePage) },
  { path: 'admin', loadComponent: () => import('./features/pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardPage), canActivate: [AdminGuard] },
  { path: 'login', loadComponent: () => import('./features/pages/login/login').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./features/pages/register/register').then(m => m.RegisterPage) },
  { path: 'leads', loadComponent: () => import('./features/pages/leads/lead-list').then(m => m.LeadListPage) },
  { path: 'leads/new', loadComponent: () => import('./features/pages/leads/lead-create').then(m => m.LeadCreatePage) },
  { path: 'leads/:id', loadComponent: () => import('./features/pages/leads/lead-detail').then(m => m.LeadDetailPage) },
  { path: 'pricing', loadComponent: () => import('./features/pages/pricing/pricing').then((m) => m.PricingPage) },
  { path: 'payment', loadComponent: () => import('./features/pages/pricing/payment-process').then((m) => m.PaymentProcessPage) },
  { path: '**', redirectTo: '' }

];
