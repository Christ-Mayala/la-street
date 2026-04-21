import { Component, inject, OnDestroy } from '@angular/core';
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
    <div class="min-h-screen flex text-slate-300 font-sans selection:bg-yellow-400/30">
      <!-- Left Side (Image Cover) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-black">
        <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop" 
             class="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" 
             alt="Urban Recovery">
        
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0c]"></div>
        
        <!-- Content Overlay -->
        <div class="absolute bottom-16 left-12 right-12 z-10 text-white animate-fade-in">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            <span class="text-sm font-medium text-slate-200">Sécurité La STREET</span>
          </div>
          <h1 class="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Accès Disruption<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Signal Perdu.</span>
          </h1>
          <p class="text-lg text-slate-300 opacity-90 max-w-lg mt-4 font-light leading-relaxed">
            Récupérez l'accès à votre terminal expert. Un code de vérification vous sera transmis par signal e-mail.
          </p>
        </div>
      </div>

      <!-- Right Side (Form) -->
      <div class="flex-1 flex flex-col pt-32 lg:justify-center px-6 sm:px-12 lg:px-24 bg-[#0a0a0c] relative overflow-hidden">
        <!-- Subtle Glows -->
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-yellow-900/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div class="w-full max-w-md mx-auto relative z-10">
          <!-- Header Area -->
          <div class="text-center lg:text-left mb-10">
             <div class="w-16 h-16 lg:mx-0 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 shadow-inner flex items-center justify-center backdrop-blur-sm">
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
             </div>
             <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">Mot de passe oublié</h2>
             <p class="text-slate-400 text-sm">Entrez votre e-mail pour recevoir les instructions de récupération.</p>
          </div>

          @if (error) {
            <div class="mb-6 p-4 bg-red-950/30 border border-red-500/20 rounded-xl backdrop-blur-sm animate-shake">
              <p class="text-xs font-bold text-red-500 uppercase tracking-widest text-center">{{ error }}</p>
            </div>
          }

          @if (codeAlreadySent) {
            <div class="space-y-8 animate-fade-in text-center lg:text-left">
              <div class="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                 <div class="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mx-auto lg:mx-0 border border-yellow-500/20">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <div class="space-y-2">
                    <h3 class="text-lg font-black text-white uppercase tracking-tighter italic">Code déjà actif</h3>
                    <p class="text-slate-500 text-xs font-medium leading-relaxed">Un signal a été envoyé vers <strong>{{ email }}</strong>. Réessayez dans {{ timeRemaining }} min ou utilisez le code reçu.</p>
                 </div>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <button (click)="goToVerify()" class="w-full py-4 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 active:scale-95 transition-all shadow-xl shadow-yellow-500/20">
                  Saisir le Code
                </button>
                <button (click)="resendCode()" class="w-full py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all opacity-50 hover:opacity-100">
                  Renvoyer le Signal
                </button>
              </div>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-1.5 group/field">
                <label class="block text-sm font-medium text-slate-300 ml-1 group-focus-within/field:text-yellow-500 transition-colors">Adresse e-mail</label>
                <div class="relative">
                  <input [(ngModel)]="email" id="email" name="email" type="email" required placeholder="john@expert.com" [disabled]="loading" class="w-full bg-[#13141a] border border-slate-800 rounded-xl py-4 px-5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all">
                </div>
              </div>

              <button type="submit" [disabled]="loading || !email" class="w-full py-4 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-20 flex items-center justify-center gap-3">
                @if (loading) {
                  <div class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Synchronisation...</span>
                } @else {
                  <span>Envoyer le code</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                }
              </button>

              <div class="text-center pt-4">
                <a routerLink="/login" class="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Retour au Terminal
                </a>
              </div>
            </form>
          }
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
export class ForgotPasswordPage implements OnDestroy {
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
    this.seo.setTitle('Accès Perdu · La STREET');
    this.seo.updateTags({
      description: 'Récupération sécurisée du terminal expert La STREET.'
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
      } else {
        this.toast.success('Demande envoyée', "Si un compte existe, vous recevrez un code par email.");
        setTimeout(() => {
          this.router.navigate(['/reset-verify'], { queryParams: { email: this.email } });
        }, 2000);
      }
    } catch (e: any) {
      const msg = e?.error?.message || e?.message || 'Signal instable. Réessayez.';
      this.error = msg;
    } finally {
      this.loading = false;
    }
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        this.codeAlreadySent = false;
      }
    }, 60000);
  }

  resendCode() {
    this.codeAlreadySent = false;
    this.onSubmit();
  }

  goToVerify() {
    if (this.timer) clearInterval(this.timer);
    this.router.navigate(['/reset-verify'], { 
      queryParams: { email: this.email } 
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
