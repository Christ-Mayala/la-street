import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-verify',
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
            Vérifier le <span class="text-yellow-400">code</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Entrez le code reçu par email pour continuer.
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
            <h2 class="text-2xl font-bold text-white">Code de réinitialisation</h2>
            <p class="mt-2 text-slate-400">Vérifions votre code avant de changer le mot de passe</p>
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
              <label for="email" class="block text-sm font-medium text-slate-300">
                Adresse email <span class="text-red-400">*</span>
              </label>
              <input
                [(ngModel)]="email"
                id="email"
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                class="w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                [disabled]="loading"
              />
            </div>

            <div class="space-y-2">
              <label for="code" class="block text-sm font-medium text-slate-300">
                Code de réinitialisation <span class="text-red-400">*</span>
              </label>
              <input
                [(ngModel)]="code"
                id="code"
                name="code"
                type="text"
                required
                placeholder="123456"
                class="w-full px-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                [disabled]="loading"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="loading || !email || !code"
            >
              <div *ngIf="loading" class="spinner-small mr-2"></div>
              <svg *ngIf="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
              </svg>
              {{ loading ? 'Vérification...' : 'Continuer' }}
            </button>

            <div class="text-center">
              <a routerLink="/forgot-password" class="text-sm text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200">
                Renvoyer un code
              </a>
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
export class ResetVerifyPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  email = '';
  code = '';
  error = '';
  loading = false;

  constructor() {
    this.seo.setTitle('Vérification du code · La STREET');
    this.seo.updateTags({
      description: 'Vérifiez votre code de réinitialisation de mot de passe La STREET.'
    });

    const qpEmail = this.route.snapshot.queryParamMap.get('email');
    if (qpEmail) this.email = qpEmail;
  }

  async onSubmit() {
    this.error = '';

    if (!this.email) {
      this.error = 'Veuillez entrer votre email.';
      return;
    }
    if (!this.code) {
      this.error = 'Veuillez entrer le code de réinitialisation.';
      return;
    }

    this.loading = true;
    try {
      const v = await firstValueFrom(this.api.verifyResetCode(this.email, this.code));
      if (!v?.valid && !v?.success) {
        this.error = 'Code invalide ou expiré.';
        return;
      }

      await this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: this.code } });
    } catch (e: any) {
      this.error = e?.message || 'Connexion impossible. Réessayez.';
      this.toast.error('Erreur', this.error);
    } finally {
      this.loading = false;
    }
  }
}
