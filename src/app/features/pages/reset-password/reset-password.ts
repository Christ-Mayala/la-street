import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-16">
        <div class="max-w-md mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-yellow-300">Sécurité</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Réinitialiser le <span class="text-yellow-400">mot de passe</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Choisissez un nouveau mot de passe. La validation backend sera ajoutée ensuite.
          </p>
        </div>
      </div>
    </section>

    <main class="container py-12 md:py-16">
      <div class="max-w-md mx-auto">
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/30 flex items-center justify-center">
              <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white">Nouveau mot de passe</h2>
            <p class="mt-2 text-slate-400">Assurez-vous qu'il soit long et unique</p>
          </div>

          <div *ngIf="tokenPresent" class="mb-6 p-4 rounded-xl border border-slate-800 bg-black/40">
            <div class="text-sm text-slate-300">
              Lien de réinitialisation détecté.
            </div>
          </div>

          <div *ngIf="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-red-300">Erreur</h3>
                <p class="text-red-200 text-sm mt-1">{{ error }}</p>
              </div>
            </div>
          </div>

          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-slate-300">
                Nouveau mot de passe <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <input
                  [(ngModel)]="password"
                  id="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  class="w-full pr-12 px-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
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

            <div class="space-y-2">
              <label for="confirm" class="block text-sm font-medium text-slate-300">
                Confirmer le mot de passe <span class="text-red-400">*</span>
              </label>
              <input
                [(ngModel)]="confirm"
                id="confirm"
                name="confirm"
                [type]="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••••"
                class="w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                [disabled]="loading"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="loading || !password || !confirm"
            >
              <div *ngIf="loading" class="spinner-small mr-2"></div>
              <svg *ngIf="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
              </svg>
              {{ loading ? 'Enregistrement...' : 'Mettre à jour' }}
            </button>

            <div class="text-center">
              <a routerLink="/login" class="text-sm text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200">
                Retour à la connexion
              </a>
            </div>

            <div class="mt-2 p-4 rounded-xl border border-slate-800 bg-black/40">
              <div class="text-sm text-slate-300">
                Cette page est prête côté UI. La validation du token et la mise à jour du mot de passe seront gérées côté backend.
              </div>
            </div>
          </form>
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
export class ResetPasswordPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  password = '';
  confirm = '';
  error = '';
  loading = false;
  showPassword = false;

  tokenPresent = false;

  constructor() {
    this.seo.setTitle('Réinitialisation du mot de passe · La STREET');
    this.seo.updateTags({
      description: 'Réinitialisez votre mot de passe La STREET en toute sécurité.'
    });

    const token = this.route.snapshot.paramMap.get('token') || this.route.snapshot.queryParamMap.get('token');
    this.tokenPresent = !!token;
  }

  async onSubmit() {
    this.error = '';
    if (!this.password || this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    if (this.password !== this.confirm) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    try {
      this.toast.success('Mot de passe mis à jour', 'Vous pouvez maintenant vous connecter.');
      await this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }
}
