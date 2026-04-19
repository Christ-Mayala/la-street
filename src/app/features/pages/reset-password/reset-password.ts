import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex text-slate-300 font-sans selection:bg-yellow-400/30">
      <!-- Left Side (Image Cover) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-black">
        <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop"
             class="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
             alt="New Password">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0c]"></div>
        <div class="absolute bottom-16 left-12 right-12 z-10 text-white animate-fade-in">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            <span class="text-sm font-medium text-slate-200">Sécurité · La STREET</span>
          </div>
          <h1 class="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Nouveau<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Mot de passe.</span>
          </h1>
          <p class="text-lg text-slate-300 opacity-90 max-w-lg mt-4 font-light leading-relaxed">
            Définissez vos nouveaux paramètres d'accès sécurisés pour reprendre le contrôle de votre terminal.
          </p>
        </div>
      </div>

      <!-- Right Side (Form) -->
      <div class="flex-1 flex flex-col pt-32 lg:justify-center px-6 sm:px-12 lg:px-24 bg-[#0a0a0c] relative overflow-hidden">
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-yellow-900/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div class="w-full max-w-md mx-auto relative z-10">
          <!-- Header -->
          <div class="text-center lg:text-left mb-10">
            <div class="w-16 h-16 lg:mx-0 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 shadow-inner flex items-center justify-center backdrop-blur-sm">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">Nouveau mot de passe</h2>
            <p class="text-slate-400 text-sm">Choisissez un mot de passe sécurisé (min. 6 caractères).</p>
          </div>

          @if (error) {
            <div class="mb-6 p-4 bg-red-950/30 border border-red-500/20 rounded-xl backdrop-blur-sm animate-shake">
              <p class="text-xs font-bold text-red-500 uppercase tracking-widest text-center">{{ error }}</p>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- New Password -->
            <div class="space-y-1.5 group/field">
              <label class="block text-sm font-medium text-slate-300 ml-1 group-focus-within/field:text-yellow-500 transition-colors">Nouveau mot de passe</label>
              <div class="relative">
                <input [(ngModel)]="password" id="password" name="password" [type]="showPassword ? 'text' : 'password'"
                       required minlength="6" placeholder="••••••••" [disabled]="loading"
                       class="w-full bg-[#13141a] border border-slate-800 rounded-xl py-4 pl-5 pr-12 text-white font-medium focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all">
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors">
                  @if (!showPassword) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  }
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-1.5 group/field">
              <label class="block text-sm font-medium text-slate-300 ml-1 group-focus-within/field:text-yellow-500 transition-colors">Confirmation</label>
              <input [(ngModel)]="confirm" id="confirm" name="confirm" [type]="showPassword ? 'text' : 'password'"
                     required minlength="6" placeholder="••••••••" [disabled]="loading"
                     class="w-full bg-[#13141a] border border-slate-800 rounded-xl py-4 px-5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all">
            </div>

            <button type="submit" [disabled]="loading || !password || !confirm"
                    class="w-full py-4 mt-4 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-20 flex items-center justify-center gap-3">
              @if (loading) {
                <div class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                <span>Mise à jour...</span>
              } @else {
                <span>Sauvegarder le mot de passe</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              }
            </button>

            <div class="text-center pt-2">
              <a routerLink="/login" class="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                Abandonner et retourner au login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class ResetPasswordPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  email = '';
  code = '';
  password = '';
  confirm = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor() {
    this.seo.setTitle('Reset_Key · La STREET');
    this.seo.updateTags({
      description: 'Réinitialisez votre mot de passe La STREET en toute sécurité.'
    });

    const qpEmail = this.route.snapshot.queryParamMap.get('email');
    if (qpEmail) this.email = qpEmail;

    const qpCode = this.route.snapshot.queryParamMap.get('code');
    if (qpCode) this.code = qpCode;
  }

  async onSubmit() {
    this.error = '';
    if (!this.email || !this.code) {
      this.error = 'Session expirée : Identifiants de réinitialisation manquants.';
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    if (this.password !== this.confirm) {
      this.error = 'Erreur_Sync : Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    try {
      await firstValueFrom(this.api.resetPassword(this.email, this.code, this.password));
      this.toast.success('Clé mise à jour', 'Votre nouvel accès est opérationnel.');
      await this.router.navigate(['/login']);
    } catch (e: any) {
      this.error = e?.error?.message || e?.message || 'Signal instable. Réessayez.';
    } finally {
      this.loading = false;
    }
  }
}
