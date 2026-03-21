import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div class="relative z-10">
        <!-- Hero Section -->
        <section class="relative overflow-hidden">
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7 missions a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-white">Récupération du compte</h2>
                <p class="mt-2 text-slate-400">Nous vous guiderons pour réinitialiser votre mot de passe</p>
              </div>

              <div *ngIf="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-red-100 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 class="font-semibold text-red-100">Erreur</h3>
                    <p class="text-red-100 text-sm mt-1">{{ error }}</p>
                  </div>
                </div>
              </div>

              <!-- Message code déjà envoyé -->
              <div *ngIf="codeAlreadySent" class="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="flex-1">
                    <h3 class="font-semibold text-blue-300">Code déjà envoyé</h3>
                    <p class="text-blue-200 text-sm mt-1">
                      Un code a déjà été envoyé à <strong>{{ email }}</strong>. 
                      Vérifiez vos emails ou attendez <strong>{{ timeRemaining }}</strong> minutes pour en recevoir un nouveau.
                    </p>
                    <div class="mt-3 flex gap-2">
                      <button 
                        type="button"
                        (click)="goToVerify()"
                        class="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm rounded-lg transition-colors duration-200"
                      >
                        J'ai reçu le code
                      </button>
                      <button 
                        type="button"
                        (click)="resendCode()"
                        class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors duration-200"
                      >
                        Renvoyer un code
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <form class="space-y-6" (ngSubmit)="onSubmit()" *ngIf="!codeAlreadySent">
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
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
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
  email = '';
  loading = false;
  error = '';
  codeAlreadySent = false;
  timeRemaining = 0;
  private timer: any;
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  constructor() {
    this.seo.setTitle('Mot de passe oublié · La STREET');
    this.seo.updateTags({
      description: 'Réinitialisez votre mot de passe La STREET en toute sécurité.'
    });
  }

  async onSubmit() {
    this.error = '';
    if (!this.email) {
      this.error = 'Veuillez entrer votre adresse email.';
      return;
    }

    this.loading = true;
    try {
      const result = await firstValueFrom(this.api.requestPasswordReset(this.email));
      
      if (result.codeAlreadySent) {
        this.codeAlreadySent = true;
        this.timeRemaining = result.timeRemaining || 15;
        this.startTimer();
        this.toast.info('Code déjà envoyé', `Un code a déjà été envoyé à ${this.email}. Vérifiez vos emails ou attendez ${this.timeRemaining} minutes pour en recevoir un nouveau.`);
      } else {
        this.toast.success('Demande envoyée', "Si un compte existe, vous recevrez un code par email.");
        setTimeout(() => {
          this.router.navigate(['/reset-verify'], { queryParams: { email: this.email } });
        }, 2000);
      }
    } catch (e: any) {
      const msg = e?.message || 'Connexion impossible. Réessayez.';
      this.error = msg;
      this.toast.error('Erreur', msg);
    } finally {
      this.loading = false;
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        this.codeAlreadySent = false;
      }
    }, 60000); // Chaque minute
  }

  resendCode() {
    this.codeAlreadySent = false;
    this.onSubmit();
  }

  goToVerify() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.router.navigate(['/reset-verify'], { 
      queryParams: { email: this.email } 
    });
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
