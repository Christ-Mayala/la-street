import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30 overflow-hidden pt-24 pb-32">
      <!-- Ambient Background -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-yellow-400/5 rounded-full blur-[150px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[20%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] animate-pulse [animation-delay:2000ms]"></div>
      </div>

      <div class="container relative z-10 px-6">
        <!-- Header -->
        <div class="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
           <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inset-0 h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              <span class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Business Intelligence</span>
           </div>
           <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
             Propulsez votre <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-200">Visibilité.</span>
           </h1>
           <p class="mt-8 text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
             Des solutions scalables pour chaque étape de votre croissance. Choisissez le protocole qui vous ressemble.
           </p>
        </div>

        <!-- Pricing Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <!-- Plan: Starter -->
          <div class="group relative p-1 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:border-white/10 hover:translate-y-[-8px] animate-fade-in-up [animation-delay:100ms]">
             <div class="relative rounded-[2.8rem] bg-black/40 p-10 h-full flex flex-col justify-between space-y-12">
                <div class="space-y-6">
                   <div class="h-1 w-16 bg-white/10"></div>
                   <h3 class="text-3xl font-black text-white uppercase tracking-tighter italic">Édition Starter</h3>
                   <div class="space-y-1">
                      <div class="flex items-baseline gap-2">
                         <span class="text-5xl font-black text-white">2k</span>
                         <span class="text-sm font-black text-slate-500 uppercase tracking-widest">FCFA / Mois</span>
                      </div>
                      <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Installation de Base</p>
                   </div>
                   <div class="h-px w-full bg-white/5"></div>
                   <ul class="space-y-4">
                      <li class="flex items-center gap-3 text-slate-400 text-sm font-medium italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         5 Opportunités / Mois
                      </li>
                      <li class="flex items-center gap-3 text-slate-400 text-sm font-medium italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         Contact Direct
                      </li>
                      <li class="flex items-center gap-3 text-slate-600 text-sm font-medium italic opacity-50">
                         <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         Mise en avant
                      </li>
                   </ul>
                </div>
                <a [routerLink]="['/payment']" [queryParams]="{plan: 'starter'}" class="w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] text-center hover:bg-white/5 transition-all">Choisir ce pack</a>
             </div>
          </div>

          <!-- Plan: Standard (ULTRA PREMIUM) -->
          <div class="group relative p-1 rounded-[3rem] bg-gradient-to-b from-yellow-500/20 to-transparent border border-yellow-500/30 backdrop-blur-3xl transition-all duration-700 hover:translate-y-[-12px] animate-fade-in-up shadow-[0_40px_100px_rgba(234,179,8,0.1)] [animation-delay:200ms]">
             <div class="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">Le plus populaire</div>
             <div class="absolute inset-0 bg-yellow-500/10 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

             <div class="relative rounded-[2.8rem] bg-black/60 p-10 h-full flex flex-col justify-between space-y-12">
                <div class="space-y-6">
                   <div class="w-16 h-1 bg-yellow-500"></div>
                   <h3 class="text-3xl font-black text-yellow-500 uppercase tracking-tighter italic">Pack Standard</h3>
                   <div class="space-y-1">
                      <div class="flex items-baseline gap-2">
                         <span class="text-5xl font-black text-white">5k</span>
                         <span class="text-sm font-black text-slate-400 uppercase tracking-widest">FCFA / Mois</span>
                      </div>
                      <p class="text-[10px] font-black text-yellow-500/50 uppercase tracking-[0.2em] italic">Efficacité Optimisée</p>
                   </div>
                   <div class="h-px w-full bg-yellow-500/10"></div>
                   <ul class="space-y-4">
                      <li class="flex items-center gap-3 text-slate-200 text-sm font-black italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         20 Opportunités / Mois
                      </li>
                      <li class="flex items-center gap-3 text-slate-200 text-sm font-black italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         Contact Direct
                      </li>
                      <li class="flex items-center gap-3 text-slate-200 text-sm font-black italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         Visibilité Standard
                      </li>
                   </ul>
                </div>
                <a [routerLink]="['/payment']" [queryParams]="{plan: 'standard'}" class="w-full py-5 bg-yellow-500 rounded-2xl text-[10px] font-black text-black uppercase tracking-[0.3em] text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-yellow-500/20">S'abonner maintenant</a>
             </div>
          </div>

          <!-- Plan: Premium -->
          <div class="group relative p-1 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:border-white/10 hover:translate-y-[-8px] animate-fade-in-up [animation-delay:300ms]">
             <div class="relative rounded-[2.8rem] bg-black/40 p-10 h-full flex flex-col justify-between space-y-12">
                <div class="space-y-6">
                   <div class="h-1 w-16 bg-white/10"></div>
                   <h3 class="text-3xl font-black text-white uppercase tracking-tighter italic">Pack Premium</h3>
                   <div class="space-y-1">
                      <div class="flex items-baseline gap-2">
                         <span class="text-5xl font-black text-white">10k</span>
                         <span class="text-sm font-black text-slate-500 uppercase tracking-widest">FCFA / Mois</span>
                      </div>
                      <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Performance Maximale</p>
                   </div>
                   <div class="h-px w-full bg-white/5"></div>
                   <ul class="space-y-4">
                      <li class="flex items-center gap-3 text-slate-400 text-sm font-medium italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         Leads Illimités
                      </li>
                      <li class="flex items-center gap-3 text-slate-400 text-sm font-medium italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         Badge de confiance
                      </li>
                      <li class="flex items-center gap-3 text-slate-400 text-sm font-medium italic">
                         <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                         Priorité Maximale
                      </li>
                   </ul>
                </div>
                <a [routerLink]="['/payment']" [queryParams]="{plan: 'premium'}" class="w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] text-center hover:bg-white/5 transition-all">Choisir le Premium</a>
             </div>
          </div>

        </div>

        <!-- Pay-Per-Lead: Tactical Section -->
        <div class="mt-32 max-w-4xl mx-auto animate-fade-in-up [animation-delay:500ms]">
           <div class="relative group p-1 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-yellow-500/20 transition-all duration-700">
              <div class="relative rounded-[2.8rem] bg-black/40 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                 <div class="w-20 h-20 rounded-[2rem] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                    <svg class="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 </div>
                 <div class="flex-1 space-y-3 text-center md:text-left">
                    <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
                       <h4 class="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Payer-au-Signal</h4>
                       <span class="px-5 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black text-yellow-500 uppercase italic tracking-[0.3em]">500 FCFA</span>
                    </div>
                    <p class="text-slate-500 font-medium leading-relaxed italic">Protocole à la demande. Débloquez uniquement les missions qui correspondent à vos ressources immédiates.</p>
                 </div>
                 <a routerLink="/leads" class="w-full md:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] text-center hover:bg-white/10 transition-all italic">Voir les Missions</a>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #050505; }
    .animate-fade-in-up {
      animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-pulse {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.2; }
    }
  `]
})
export class PricingPage {
  private seo = inject(SeoService);

  constructor() {
    this.seo.setTitle('Abonnements · La STREET');
  }
}
