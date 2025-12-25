import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
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
            <span class="text-sm font-medium text-yellow-300">Compte & Accès</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Mot de passe <span class="text-yellow-400">oublié</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Entrez votre email. La logique d'envoi sera branchée côté backend.
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
            <h2 class="text-2xl font-bold text-white">Récupération du compte</h2>
            <p class="mt-2 text-slate-400">Nous vous guiderons pour réinitialiser votre mot de passe</p>
          </div>

          <form class="space-y-6" (ngSubmit)="onSubmit()">
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

            <button
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="loading || !email"
            >
              <div *ngIf="loading" class="spinner-small mr-2"></div>
              <svg *ngIf="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              {{ loading ? 'Traitement...' : 'Envoyer le lien' }}
            </button>

            <div class="text-center">
              <a routerLink="/login" class="text-sm text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200">
                Retour à la connexion
              </a>
            </div>

            <div class="mt-2 p-4 rounded-xl border border-slate-800 bg-black/40">
              <div class="text-sm text-slate-300">
                Cette page est prête côté UI. La logique d'envoi d'email sera connectée au backend plus tard.
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
export class ForgotPasswordPage {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  email = '';
  loading = false;

  constructor() {
    this.seo.setTitle('Mot de passe oublié · La STREET');
    this.seo.updateTags({
      description: 'Demandez un lien de réinitialisation de mot de passe pour votre compte La STREET.'
    });
  }

  async onSubmit() {
    if (!this.email) return;
    this.loading = true;
    try {
      this.toast.success('Demande envoyée', "Si un compte existe, vous recevrez un lien par email.");
      await this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }
}
