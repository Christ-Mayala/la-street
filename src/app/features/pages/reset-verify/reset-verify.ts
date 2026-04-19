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
    <div class="min-h-screen flex text-slate-300 font-sans selection:bg-yellow-400/30">
      <!-- Left Side (Image Cover) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-black">
        <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop"
             class="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
             alt="Urban Verification">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0c]"></div>
        <div class="absolute bottom-16 left-12 right-12 z-10 text-white animate-fade-in">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            <span class="text-sm font-medium text-slate-200">Vérification · La STREET</span>
          </div>
          <h1 class="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Code de<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Vérification.</span>
          </h1>
          <p class="text-lg text-slate-300 opacity-90 max-w-lg mt-4 font-light leading-relaxed">
            Saisissez le code secret transmis à votre adresse e-mail pour valider votre identité.
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">Vérification du code</h2>
            <p class="text-slate-400 text-sm">Entrez le code à 6 chiffres reçu par e-mail.</p>
          </div>

          @if (error) {
            <div class="mb-6 p-4 bg-red-950/30 border border-red-500/20 rounded-xl backdrop-blur-sm animate-shake">
              <p class="text-xs font-bold text-red-500 uppercase tracking-widest text-center">{{ error }}</p>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-400 ml-1">Email de destination</label>
              <input [(ngModel)]="email" id="email" name="email" type="email" required readonly
                     class="w-full bg-white/5 border border-slate-800 rounded-xl py-4 px-5 text-slate-500 font-medium outline-none cursor-not-allowed italic">
            </div>

            <div class="space-y-1.5 group/field">
              <label class="block text-sm font-medium text-slate-300 ml-1 group-focus-within/field:text-yellow-500 transition-colors">Code secret</label>
              <input [(ngModel)]="code" id="code" name="code" type="text" required placeholder="XXXXXX" [disabled]="loading"
                     class="w-full bg-[#13141a] border border-slate-800 rounded-xl py-4 px-5 text-white font-black text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-700">
            </div>

            <button type="submit" [disabled]="loading || !email || !code"
                    class="w-full py-4 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-20 flex items-center justify-center gap-3">
              @if (loading) {
                <div class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                <span>Validation...</span>
              } @else {
                <span>Valider l'accès</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              }
            </button>

            <div class="text-center pt-2">
              <a routerLink="/forgot-password" class="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-yellow-500 transition-colors">
                Renvoyer un nouveau code
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
    this.seo.setTitle('Validation_Check · La STREET');
    this.seo.updateTags({
      description: 'Vérifiez votre code de réinitialisation de mot de passe La STREET.'
    });

    const qpEmail = this.route.snapshot.queryParamMap.get('email');
    if (qpEmail) this.email = qpEmail;
  }

  async onSubmit() {
    this.error = '';

    if (!this.email) {
      this.error = 'Identifiant email manquant.';
      return;
    }
    if (!this.code) {
      this.error = 'Veuillez saisir le code secret.';
      return;
    }

    this.loading = true;
    try {
      const v = await firstValueFrom(this.api.verifyResetCode(this.email, this.code));
      if (!v?.valid && !v?.success) {
        this.error = 'Signal corrompu : Code invalide ou expiré.';
        return;
      }

      await this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: this.code } });
    } catch (e: any) {
      this.error = e?.error?.message || e?.message || 'Connexion instable. Réessayez.';
    } finally {
      this.loading = false;
    }
  }
}
