import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 right-1/3 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-16">
        <div class="max-w-md mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-yellow-300">Accès sécurisé</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            <span class="text-yellow-400">Bienvenue</span> à bord
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Connectez-vous pour accéder à toutes les fonctionnalités de La STREET
          </p>
        </div>
      </div>
    </section>

    <!-- Login Form -->
    <main class="container py-12 md:py-16">
      <div class="max-w-md mx-auto">
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/30 flex items-center justify-center">
              <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">Connexion à votre compte</h2>
            <p class="mt-2 text-slate-400">Accédez à votre espace personnel</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-red-300">Erreur de connexion</h3>
                <p class="text-red-200 text-sm mt-1">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Login Form -->
          <form class="space-y-6" (ngSubmit)="onLogin()">
            <!-- Email Field -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-slate-300">
                Adresse email <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                <input
                  [(ngModel)]="email"
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  [disabled]="loading"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-slate-300">
                  Mot de passe <span class="text-red-400">*</span>
                </label>
                <a routerLink="/forgot-password" class="text-sm text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200">
                  Mot de passe oublié ?
                </a>
              </div>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input
                  [(ngModel)]="password"
                  id="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Votre mot de passe"
                  class="w-full pl-12 pr-12 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  [disabled]="loading"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors duration-200"
                  (click)="showPassword = !showPassword"
                  [disabled]="loading"
                  [attr.aria-label]="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                >
                  <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="loading || !email || !password"
            >
              <div *ngIf="loading" class="spinner-small mr-2"></div>
              <svg *ngIf="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-800"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-black text-slate-400">Ou</span>
              </div>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-slate-400">
                Vous n'avez pas de compte ?
                <a routerLink="/register" class="text-yellow-300 hover:text-yellow-400 hover:underline font-semibold transition-colors duration-200 ml-1">
                  Créez-en un ici
                </a>
              </p>
            </div>
          </form>

          <!-- Additional Info -->
          <div class="mt-8 pt-8 border-t border-slate-800">
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <div>
                  <h4 class="font-medium text-white">Connexion sécurisée</h4>
                  <p class="text-sm text-slate-400 mt-1">Vos données sont protégées par un chiffrement de bout en bout.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h4 class="font-medium text-white">Pourquoi se connecter ?</h4>
                  <p class="text-sm text-slate-400 mt-1">Accédez à votre profil, gérez vos favoris, contactez des professionnels et plus encore.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .hero-bg {
      background-image:
        radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.03) 0%, transparent 50%);
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  private scrollToTop() {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  constructor() {
    this.seo.setTitle('Connexion · La STREET');
    this.seo.updateTags({
      description: 'Connectez-vous à votre compte La STREET pour accéder à toutes les fonctionnalités de la plateforme.'
    });

    const u = this.auth.user();
    if (String(u?.role || '').toLowerCase() === 'admin') this.router.navigate(['/admin']);
    else if (u?.token) this.router.navigate(['/']);
  }

  async onLogin() {
    this.error = '';
    this.loading = true;
    try {
      const u = await this.auth.login(this.email, this.password);
      this.toast.success('Bienvenue', `Bonjour ${u?.name || ''}`.trim());
      if (String(u?.role || '').toLowerCase() === 'admin') this.router.navigate(['/admin']);
      else this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message || 'Email ou mot de passe incorrect';
      this.toast.error('Erreur', this.error);
      this.scrollToTop();
    } finally {
      this.loading = false;
    }
  }
}
